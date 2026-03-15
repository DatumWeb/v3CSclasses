/**
 * Search input for filtering courses by title, code, or description.
 */
"use client";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchFilter({
  value,
  onChange,
  placeholder = "Search by course code, title, or description…",
}: SearchFilterProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-400 p-2 font-mono text-sm"
    />
  );
}
