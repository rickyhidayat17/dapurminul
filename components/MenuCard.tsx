"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import LevelModal from "./LevelModal";

export default function MenuCard({ item }: any) {
  const { cart, addToCart, decreaseQty } = useCart();
  const [openLevel, setOpenLevel] = useState(false);

  const isNeedLevel =
    item.category === "Basreng & Otak-otak" ||
    item.category === "Pangsit" && item.name !== "Pangsit Mentai";

  // hanya hitung item tanpa variant (normal item)
  const cartItem = cart.find(
  (i) =>
    i.id === item.id &&
    (i.variantId ?? "normal") === "normal"
);

  const qty = cart
  .filter((i) => i.id === item.id)
  .reduce((total, i) => total + i.qty, 0);

  const handleAdd = () => {
  // Kalau item butuh level → selalu buka modal
  if (isNeedLevel) {
    setOpenLevel(true);
    return;
  }

  // Kalau tidak butuh level → langsung tambah
  addToCart({
    id: item.id,
    name: item.name,
    price: item.price,
  });

  toast.success(`${item.name} ditambahkan`);
};

  const handleSelectLevel = (level: string) => {
  addToCart({
    id: item.id,
    variantId: `${item.id}-${level}`,
    name: `${item.name} (${level})`,
    price: item.price,
    level,
  });

  toast.success(`${item.name} Level ${level} ditambahkan`);
  setOpenLevel(false);
};

const handleDecrease = () => {
  const lastItem = [...cart]
    .reverse()
    .find((i) => i.id === item.id);

  if (lastItem) {
    decreaseQty(lastItem.id, lastItem.variantId);
  }
};

  return (
  <>
    <div className="relative flex gap-3 bg-white p-3 rounded-xl shadow-sm border items-center">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 rounded-lg object-cover"
      />

      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item.desc}</p>
        <p className="text-primary font-bold mt-1">
          Rp {item.price.toLocaleString()}
        </p>
      </div>

      {qty === 0 ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleAdd}
          className="bg-orange-500 text-white p-2 rounded-full shadow-md"
        >
          <Plus size={18} />
        </motion.button>
      ) : (
        <div className="flex items-center gap-2 bg-orange-500 text-white rounded-full px-2 py-1 shadow-md">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleDecrease}
          >
            <Minus size={16} />
          </motion.button>

          <AnimatePresence mode="wait">
            <motion.span
              key={qty}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-semibold min-w-[16px] text-center"
            >
              {qty}
            </motion.span>
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleAdd}
          >
            <Plus size={16} />
          </motion.button>
        </div>
      )}
    </div>

    {openLevel && (
      <LevelModal
        item={item}
        onClose={() => setOpenLevel(false)}
        onSelect={handleSelectLevel}
      />
    )}
  </>
);
}
