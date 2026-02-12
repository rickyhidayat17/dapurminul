"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  variantId?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerWA: string;
  address: string;
  items: CartItem[];
  total: number;
  status: string;
  date: string;
}

/* ================= COMPONENT ================= */

export default function HistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("orders");
    if (saved) {
      const parsed: Order[] = JSON.parse(saved);
      setOrders(parsed.reverse());
    }
  }, []);

  const handleReorder = (items: CartItem[]) => {
    // simpan ulang item ke cart
    localStorage.setItem("cart", JSON.stringify(items));
    // arahkan ke menu utama
    router.push("/");
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24 px-4 pt-4">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleBack}
          className="text-sm bg-gray-200 px-3 py-1.5 rounded-full"
        >
          ← Kembali
        </button>
        <h1 className="text-xl font-bold">Riwayat Pesanan</h1>
      </div>

      {orders.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          Belum ada riwayat pesanan
        </div>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          {/* HEADER ORDER */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-semibold text-sm">
                {order.id}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(order.date).toLocaleString("id-ID")}
              </p>
            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600">
              {order.status}
            </span>
          </div>

          {/* ITEMS */}
          <div className="border-t border-b py-2 mb-2">
            {order.items.map((item) => (
              <div
                key={`${item.id}-${item.variantId ?? "normal"}`}
                className="flex justify-between text-sm text-gray-600 mb-1"
              >
                <span>
                  {item.name} x {item.qty}
                </span>
                <span>
                  Rp {(item.price * item.qty).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center">
            <p className="font-bold text-orange-500">
              Rp {order.total.toLocaleString("id-ID")}
            </p>

            <button
              onClick={() => handleReorder(order.items)}
              className="text-sm bg-orange-500 text-white px-4 py-1.5 rounded-full hover:opacity-90 transition"
            >
              Pesan Lagi
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
