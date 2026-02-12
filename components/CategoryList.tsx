"use client";
import { useState } from "react";
import { categories } from "@/data/menu";

export default function CategoryList({ onSelect }: any) {
  const [active, setActive] = useState("Semua");

  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-3">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            setActive(cat);
            onSelect(cat);
          }}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            active === cat
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
