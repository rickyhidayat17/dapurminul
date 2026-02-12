"use client";

import { useCart } from "@/app/context/CartContext";
import { Minus, Plus, Trash, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, addToCart, decreaseQty, removeFromCart, totalPrice, clearCart, saveOrder } =
    useCart();
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [alamat, setAlamat] = useState("");

  // Nomor WA admin dari env
  const adminWA = process.env.NEXT_PUBLIC_ADMIN_WA || "083821355172";

  // Validasi nomor WA Indonesia
  const validateWA = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    return /^08\d{8,11}$/.test(cleaned);
  };

  
  const handleCheckout = async () => {
  if (!nama || !wa || !alamat) {
    alert("Mohon lengkapi data pemesan");
    return;
  }

  if (!validateWA(wa)) {
    alert("Nomor WA tidak valid. Gunakan format 08xxxxxxxxxx");
    return;
  }

  if (cart.length === 0) {
    alert("Keranjang kosong");
    return;
  }

  const cleanedWA = wa.replace(/\D/g, "");
  const orderId = "ORD" + Date.now();

  const orderList = cart
    .map(
      (item, index) =>
        `${index + 1}. ${item.name}\n   ${item.qty} x Rp ${item.price.toLocaleString()}`
    )
    .join("\n\n");

  const message = `
*ORDER DAPUR MINUL*
ID Order: ${orderId}

Nama: ${nama}
No WA: ${cleanedWA}
Alamat: ${alamat}

-------------------------
*Detail Pesanan:*
${orderList}

-------------------------
Total: Rp ${totalPrice.toLocaleString()}

Silahkan selesaikan payment :
Bank Mandiri a/n MEGA RAHMAWANTI
1300020043801

Terima kasih
`;

  const encodedMessage = encodeURIComponent(message);

  const newOrder = {
    id: orderId,
    customerName: nama,
    customerWA: cleanedWA,
    address: alamat,
    items: cart,
    total: totalPrice,
    status: "Selesai",
    date: new Date().toISOString(), // penting untuk history
  };

  // Simpan ke context (kalau ada backend logic)
  await saveOrder(newOrder);

  // Simpan ke localStorage untuk halaman history
  const storedOrders = localStorage.getItem("orders");
const existingOrders = storedOrders
  ? JSON.parse(storedOrders)
  : [];

  localStorage.setItem(
    "orders",
    JSON.stringify([...existingOrders, newOrder])
  );

  window.open(
    `https://wa.me/62${adminWA.substring(1)}?text=${encodedMessage}`,
    "_blank"
  );

  clearCart();

  // reset form
  setNama("");
  setWa("");
  setAlamat("");

  // 🔥 redirect ke halaman history
  router.push("/history");
};


  return (
    <div className="p-4 pb-24">
      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-4 text-gray-600"
      >
        <ArrowLeft size={18} />
        Kembali
      </button>

      <h1 className="text-xl font-bold mb-4">Review Order</h1>

      {/* FORM */}
      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Nama Pemesan"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="No WhatsApp"
          value={wa}
          onChange={(e) => setWa(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        <textarea
          placeholder="Alamat Kirim"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          className="w-full border p-3 rounded-lg"
          rows={3}
        />
      </div>

      {/* LIST PESANAN */}
      {cart.map((item) => (
  <div
    key={`${item.id}-${item.variantId ?? "normal"}`}
    className="flex justify-between items-center mb-4 bg-white p-3 rounded-xl shadow"
  >
    <div>
      <p className="font-semibold">{item.name}</p>
      <p className="text-sm text-gray-500">
        Rp {item.price.toLocaleString()}
      </p>
    </div>

    <div className="flex items-center gap-3">
      {/* MINUS */}
      <button
        onClick={() => decreaseQty(item.id, item.variantId)}
        className="p-1"
      >
        <Minus size={16} />
      </button>

      <span className="min-w-[20px] text-center font-semibold">
        {item.qty}
      </span>

      {/* PLUS */}
      <button
        onClick={() =>
          addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            variantId: item.variantId,
          })
        }
        className="p-1"
      >
        <Plus size={16} />
      </button>

      {/* DELETE */}
      <button
        onClick={() =>
          removeFromCart(item.id, item.variantId)
        }
        className="text-red-500 p-1"
      >
        <Trash size={16} />
      </button>
    </div>
  </div>
))}

      {/* TOTAL */}
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>Rp {totalPrice.toLocaleString()}</span>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full mt-4 bg-orange-500 hover:bg-orange-600 transition-colors text-white py-3 rounded-xl font-semibold"
        >
          Checkout Sekarang
        </button>
      </div>
    </div>
  );
}
