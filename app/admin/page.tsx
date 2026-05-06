"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { menus as initialMenus } from "@/data/menu";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export default function AdminPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const defaultForm: Product = {
    id: "",
    name: "",
    price: 0,
    image: "",
    category: "Dimsum",
    stock: 0,
  };

  const [form, setForm] = useState<Product>(defaultForm);

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

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  const resetForm = () => {
    setForm(defaultForm);
    setIsEditing(false);
  };

  const handleLogin = () => {
    if (username === "Dapurminul" && password === "@minul2024") {
      setIsLogin(true);
    } else {
      alert("Username atau Password salah");
    }
  };

  const handleLogout = () => {
    setIsLogin(false);
    setUsername("");
    setPassword("");
    resetForm();
  };

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.category || !form.stock) {
      alert("Semua field wajib diisi");
      return;
    }

    if (isEditing) {
      setProducts((prev) =>
        prev.map((item) => (item.id === form.id ? form : item))
      );
    } else {
      setProducts((prev) => [
        ...prev,
        {
          ...form,
          id: Date.now().toString(),
        },
      ]);
    }

    resetForm();
  };

  const handleEdit = (item: Product) => {
    setForm(item);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center px-4 py-6">
      <div className="w-full max-w-md space-y-5">
        {!isLogin ? (
          <div className="bg-white rounded-3xl shadow-sm border p-6 space-y-4">
            <button
              onClick={() => window.location.href = "/"}
              className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-white hover:shadow-md"
            >
              <span className="text-base">←</span>
              <span>Kembali ke Beranda</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold">Login Admin</h1>
              <p className="text-sm text-gray-500 mt-1">
                Masuk untuk mengelola produk dan stok
              </p>
            </div>

            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-2xl border px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-orange-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              onClick={handleLogin}
              className="w-full rounded-2xl bg-orange-500 text-white font-semibold py-3 shadow-sm"
            >
              Login Admin
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl shadow-sm border p-5 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Dashboard Admin</h1>
                <p className="text-sm text-gray-500">Kelola menu Dapur Minul</p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl border px-4 py-2 text-sm font-medium"
              >
                Logout
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border p-5 space-y-4">
              <h2 className="text-lg font-bold">
                {isEditing ? "Edit Produk" : "Tambah Produk"}
              </h2>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Nama Produk</label>
                <input
                  type="text"
                  placeholder="Nama Produk"
                  className="w-full rounded-2xl border px-4 py-3"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Kategori Produk</label>
                <input
                  type="text"
                  placeholder="Kategori Produk"
                  className="w-full rounded-2xl border px-4 py-3"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Harga Produk</label>
                <input
                  type="number"
                  placeholder="Harga"
                  className="w-full rounded-2xl border px-4 py-3"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Qty Stock</label>
                <input
                  type="number"
                  placeholder="Stock"
                  className="w-full rounded-2xl border px-4 py-3"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Foto Produk</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setForm({
                        ...form,
                        image: imageUrl,
                      });
                    }
                  }}
                  className="w-full text-sm"
                />
              </div>

              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-44 rounded-2xl object-cover border"
                />
              )}

              <button
                onClick={handleSubmit}
                className="w-full rounded-2xl bg-black text-white font-semibold py-3"
              >
                {isEditing ? "Update Produk" : "Tambah Produk"}
              </button>
            </div>

            <div className="space-y-4">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl shadow-sm border p-4"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-44 object-cover rounded-2xl mb-4"
                    />
                  )}

                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500">Kategori: {item.category}</p>
                    <p className="font-semibold">Rp {item.price.toLocaleString()}</p>
                    <p className="text-sm">
                      Stock: {item.stock <= 0 ? "Habis" : item.stock}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 rounded-2xl border py-2 font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 rounded-2xl bg-red-500 text-white py-2 font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
