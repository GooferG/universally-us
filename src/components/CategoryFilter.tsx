"use client";

import { WPCategory } from "@/lib/api";

interface CategoryFilterProps {
  categories: WPCategory[];
  activeId: number | null;
  onChange: (id: number | null) => void;
}

export default function CategoryFilter({ categories, activeId, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-5 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded-full border ${
          activeId === null
            ? "bg-[#C4775A] border-[#C4775A] text-white shadow-sm"
            : "border-[#D4C4B0] text-[#7A7470] hover:border-[#C4775A] hover:text-[#C4775A]"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-5 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded-full border ${
            activeId === cat.id
              ? "bg-[#C4775A] border-[#C4775A] text-white shadow-sm"
              : "border-[#D4C4B0] text-[#7A7470] hover:border-[#C4775A] hover:text-[#C4775A]"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
