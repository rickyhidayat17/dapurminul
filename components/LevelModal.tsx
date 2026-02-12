"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function LevelModal({ item, onClose, onSelect }: any) {
  const levels = ["Level 0","Level 1","Level 2","Level 3","Level 4","Level 5"];

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[9999] flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3 }}
        className="relative bg-white w-full max-w-md mx-auto rounded-t-3xl p-5"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">
            Pilih Level Pedas
          </h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="space-y-3 mb-5">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelected(lvl)}
              className={`w-full border rounded-xl p-3 text-left transition 
              ${selected === lvl 
                ? "border-orange-500 bg-orange-50" 
                : "hover:border-orange-300"}`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <button
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
          className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold disabled:opacity-40"
        >
          Tambahkan ke Keranjang
        </button>
      </motion.div>
    </div>
  );
}
