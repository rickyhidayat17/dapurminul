"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CategoryList from "@/components/CategoryList";
import MenuCard from "@/components/MenuCard";
import BottomNav from "@/components/BottomNav";
import { menus as initialMenus } from "@/data/menu";

export default function Home() {
  const [selected, setSelected] = useState("Semua");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(
        initialMenus.map((item: any) => ({
          ...item,
          image: item.image || "",
          stock: item.stock ?? 10,
        }))
      );
    }
  }, []);

  const categories = [
    "Semua",
    ...new Set(products.map((item) => item.category)),
  ];

  const filtered =
    selected === "Semua"
      ? products
      : products.filter((m) => m.category === selected);

  return (
    <main className="min-h-screen bg-bgSoft flex justify-center">
      <div className="w-full max-w-md bg-bgSoft relative pb-20">
        <Header />

        <CategoryList
          categories={categories}
          onSelect={setSelected}
        />

        <div className="px-4 space-y-3">
          {filtered.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
            />
          ))}
        </div>

        <BottomNav />
      </div>
    </main>
  );
}