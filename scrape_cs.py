import json
import time
import re
import subprocess
import tempfile
import requests

BASE_URL = "https://catalog.byu.edu"
DEPT_URL = f"{BASE_URL}/departments/1323/courses"

session = requests.Session()
session.headers.update({
    "User-Agent": "BYU-CS-IA-Project/1.0 (student project)"
})


def extract_nuxt_data(url, retries=3):
    """Fetch a catalog page and evaluate its window.__NUXT__ state via Node.js.

    The BYU catalog is a Nuxt.js SPA — the HTML shell contains no rendered
    content.  All data is embedded in a self-invoking JS function assigned to
    window.__NUXT__.  We extract that snippet, run it through Node, and return
    the resulting Python dict.
    """
    for attempt in range(retries):
        resp = session.get(url)
        if resp.status_code == 405 and "captcha" in resp.headers.get("x-amzn-waf-action", ""):
            wait = 10 * (attempt + 1)
            print(f"  WAF captcha block — waiting {wait}s before retry ({attempt+1}/{retries})")
            time.sleep(wait)
            continue
        break
    resp.raise_for_status()

    m = re.search(r"window\.__NUXT__=(.*?)\s*</script>", resp.text, re.DOTALL)
    if not m:
        raise ValueError(f"Could not find __NUXT__ state in {url}")

    nuxt_js = m.group(1)

    # Write a tiny Node script that evaluates the expression and dumps JSON
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
        f.write("const fs = require('fs');\n")
        f.write("const window = {};\n")
        f.write(f"window.__NUXT__ = {nuxt_js};\n")
        f.write("process.stdout.write(JSON.stringify(window.__NUXT__));\n")
        tmp_path = f.name

    result = subprocess.run(
        ["node", tmp_path],
        capture_output=True,
        text=True,
        timeout=30,
    )
    if result.returncode != 0:
        raise RuntimeError(f"Node eval failed: {result.stderr[:500]}")

    return json.loads(result.stdout)


def get_course_list():
    """Return a list of course dicts from the department page.

    Each dict contains basic info (code, name, credits, description, etc.)
    from the department listing.  This serves as both the master list and a
    fallback when individual course pages are unavailable.
    """
    data = extract_nuxt_data(DEPT_URL)
    return data["data"][1]["coursesFallback"]


def parse_requisites(requisites, id_to_code):
    """Turn the structured requisites into deterministic prereq/coreq data.

    The catalog stores requisites as nested rules referencing courseGroupIds.
    We resolve those IDs to human-readable course codes (e.g. "C S 235").

    Returns (prereq_structured, coreq_structured, prereq_text, coreq_text)
    where *_structured is a list of rule dicts like:
        {"type": "allOf", "courses": ["C S 224", "C S 240"], "logic": "and"}
    and *_text is a human-readable summary string.
    """
    prereqs = []
    coreqs = []

    for block in requisites.get("requisitesSimple", []):
        req_type = block.get("type", "")  # "Prerequisite" or "Corequisite"
        target = prereqs if "Prerequisite" in req_type else coreqs

        for rule in block.get("rules", []):
            condition = rule.get("condition", "")
            value = rule.get("value", {})
            if value.get("condition") != "courses":
                continue
            for group in value.get("values", []):
                logic = group.get("logic", "and")
                ids = group.get("value", [])
                codes = [id_to_code.get(cid, cid) for cid in ids]
                target.append({
                    "type": condition,
                    "logic": logic,
                    "courses": codes,
                })

    def to_text(rules):
        parts = []
        for r in rules:
            joiner = " and " if r["logic"] == "and" else " or "
            parts.append(joiner.join(r["courses"]))
        return "; ".join(parts)

    return prereqs, coreqs, to_text(prereqs), to_text(coreqs)


def build_course_from_listing(c):
    """Build a course dict from the basic department-listing data."""
    credits_obj = c.get("credits", {})
    credit_hours = credits_obj.get("creditHours", {})

    return {
        "subject": c.get("subjectCode"),
        "number": c.get("courseNumber"),
        "title": c.get("longName") or c.get("name"),
        "code": c.get("code"),
        "credits": credit_hours.get("value"),
        "college": "",
        "department": "Computer Science",
        "description": c.get("description", "").strip(),
        "whenTaught": [],
        "prerequisites": [],
        "corequisites": [],
        "prereqText": "",
        "coreqText": "",
        "repeatableForCredit": "R" in (c.get("courseNumber") or ""),
        "courseId": c.get("courseGroupId"),
        "catalogUrl": f"{BASE_URL}/courses/{c.get('courseGroupId')}",
        "expectedLearningOutcomes": [],
        "notes": ""
    }


def parse_course_page(course_group_id, id_to_code):
    """Fetch an individual course page and extract its data from __NUXT__."""
    url = f"{BASE_URL}/courses/{course_group_id}"
    data = extract_nuxt_data(url)
    c = data["data"][0]["course"]

    credits_obj = c.get("credits", {})
    credit_hours = credits_obj.get("creditHours", {})
    credits = credit_hours.get("value")

    custom = c.get("customFields", {})

    description = c.get("description", "").strip()

    when_taught = c.get("courseTypicallyOffered", "")
    when_taught_list = [p.strip() for p in when_taught.split(",") if p.strip()] if when_taught else []

    # Structured enforced requisites (prereqs & coreqs with course codes)
    requisites = c.get("requisites", {})
    prereqs, coreqs, prereq_text, coreq_text = parse_requisites(requisites, id_to_code)

    # Append non-enforced prerequisites (freetext notes like "or instructor's consent")
    non_enforced = (custom.get("nonEnforcedPrerequisites", "") or "").strip()
    if non_enforced:
        prereq_text = f"{prereq_text}; {non_enforced}" if prereq_text else non_enforced

    learning_outcomes = []
    for lo in c.get("learningOutcomes", []):
        name = lo.get("name", "")
        objective = lo.get("objective", "")
        if name or objective:
            learning_outcomes.append({"name": name, "objective": objective})

    dept_list = c.get("departments", [])
    department = ""
    if dept_list and isinstance(dept_list[0], dict):
        department = dept_list[0].get("displayName", "")

    course = {
        "subject": c.get("subjectCode"),
        "number": c.get("courseNumber"),
        "title": c.get("longName") or c.get("name"),
        "code": c.get("code"),
        "credits": credits,
        "college": c.get("college", ""),
        "department": department,
        "description": description,
        "whenTaught": when_taught_list,
        "prerequisites": prereqs,
        "corequisites": coreqs,
        "prereqText": prereq_text,
        "coreqText": coreq_text,
        "repeatableForCredit": "R" in (c.get("courseNumber") or ""),
        "courseId": course_group_id,
        "catalogUrl": f"{BASE_URL}/courses/{course_group_id}",
        "expectedLearningOutcomes": learning_outcomes,
        "notes": ""
    }
    return course


def main():
    print("Fetching department course list...")
    listing = get_course_list()
    print(f"Found {len(listing)} courses in department listing")

    # Build a courseGroupId → course code lookup (across ALL departments)
    # so we can resolve prereq references like "10648-000" → "C S 235"
    id_to_code = {c["courseGroupId"]: c["code"] for c in listing if c.get("code")}

    # Filter to C S courses only
    cs_listing = [c for c in listing if c.get("subjectCode") == "C S"]
    cs_listing.sort(key=lambda c: c.get("orderByKeyForCode", ""))
    print(f"  {len(cs_listing)} are C S courses")

    courses = []
    for i, entry in enumerate(cs_listing):
        cid = entry["courseGroupId"]
        code = entry.get("code", cid)
        print(f"[{i+1}/{len(cs_listing)}] Fetching {code} ({cid}) ...")
        try:
            course = parse_course_page(cid, id_to_code)
            courses.append(course)
            print(f"  -> {course['code']} — {course['title']}")
        except Exception as e:
            # Fall back to the basic data from the department listing
            course = build_course_from_listing(entry)
            courses.append(course)
            print(f"  -> {course['code']} — {course['title']}  (from listing; {e})")
        time.sleep(1.5)  # be polite — too fast triggers AWS WAF captcha

    with open("cs-courses.json", "w", encoding="utf-8") as f:
        json.dump(courses, f, ensure_ascii=False, indent=2)

    print(f"\nWrote {len(courses)} C S courses to cs-courses.json")


if __name__ == "__main__":
    main()
