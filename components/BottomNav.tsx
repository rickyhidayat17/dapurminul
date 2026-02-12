"use client";

import { Home, ShoppingCart, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const active = "text-orange-500";
  const inactive = "text-gray-400";

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t flex justify-around py-2 shadow-lg">

      {/* HOME */}
      <Link
        href="/"
        className={`flex flex-col items-center text-xs ${
          pathname === "/" ? active : inactive
        }`}
      >
        <Home size={22} />
        <span>Home</span>
      </Link>

      {/* CHECKOUT */}
      <Link
        href="/checkout"
        className={`relative flex flex-col items-center text-xs ${
          pathname === "/checkout" ? active : inactive
        }`}
      >
        <ShoppingCart size={22} />

        {totalItems > 0 && (
          <span className="absolute top-0 right-2 bg-orange-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
            {totalItems}
          </span>
        )}

        <span>Checkout</span>
      </Link>

      {/* HISTORY */}
      <Link
        href="/history"
        className={`flex flex-col items-center text-xs ${
          pathname === "/history" ? active : inactive
        }`}
      >
        <History size={22} />
        <span>Riwayat</span>
      </Link>
    </div>
  );
}
