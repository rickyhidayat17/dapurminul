"use client";

import { motion } from "framer-motion";

export default function CategoryList({
  categories,
  selected,
  onSelect,
}: any) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-3">
      {categories.map((category: string) => (
        <motion.button
          key={category}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
            ${
              selected === category
                ? "bg-orange-500 text-white shadow-md"
                : "bg-white border text-gray-700"
            }
          `}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
}