"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CategoryList from "@/components/CategoryList";
import MenuCard from "@/components/MenuCard";
import BottomNav from "@/components/BottomNav";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
} from "firebase/firestore";

export default function Home() {
  const [selected, setSelected] = useState("Semua");
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(
      collection(db, "products")
    );

    const productList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setProducts(productList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [
    "Semua",
    ...new Set(products.map((item) => item.category)),
  ];

  const filtered =
    selected === "Semua"
      ? products
      : products.filter(
          (item) => item.category === selected
        );

  return (
    <main className="min-h-screen bg-bgSoft flex justify-center">
      <div className="w-full max-w-md bg-bgSoft relative pb-20">
        <Header />

        <CategoryList
          categories={categories}
          selected={selected}
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