"use client";

import { useState } from "react";
import Header from "@/components/Header";
import CategoryList from "@/components/CategoryList";
import MenuCard from "@/components/MenuCard";
import BottomNav from "@/components/BottomNav";
import { menus } from "@/data/menu";

export default function Home() {
  const [selected, setSelected] = useState("Semua");

  const filtered =
    selected === "Semua"
      ? menus
      : menus.filter((m) => m.category === selected);

  return (
    <main className="min-h-screen bg-bgSoft flex justify-center">
      <div className="w-full max-w-md bg-bgSoft relative pb-20">
        <Header />
        <CategoryList onSelect={setSelected} />

        <div className="px-4 space-y-3">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
