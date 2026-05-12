"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, LogOut, Pencil, Trash2, Plus } from "lucide-react";
import { menus as initialMenus } from "@/data/menu";
import { supabase } from "@/lib/supabase";

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
    category: "",
    stock: 0,
  };

  const [form, setForm] = useState<Product>(defaultForm);

  const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  if (data) {
    setProducts(data);
  }
};

useEffect(() => {
  fetchProducts();
}, []);

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

 const handleSubmit = async () => {
  if (!form.name || !form.price || !form.category) {
    alert("Nama produk, harga, dan kategori wajib diisi");
    return;
  }

  const payload = {
    name: form.name,
    price: form.price,
    image: form.image,
    category: form.category,
    stock: Number(form.stock), // 0 = stok habis
  };

  // UPDATE PRODUCT
  if (isEditing) {
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", form.id);

    if (error) {
      console.log(error);
      alert("Gagal update produk");
      return;
    }
  }

  // ADD PRODUCT
  else {
    const { error } = await supabase
      .from("products")
      .insert([payload]);

    if (error) {
      console.log(error);
      alert("Gagal tambah produk");
      return;
    }
  }

  await fetchProducts();
  resetForm();
};

const handleEdit = (item: Product) => {
  setForm(item);
  setIsEditing(true);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleDelete = async (id: string) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("Gagal menghapus produk");
    return;
  }

  await fetchProducts();
};

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto w-full max-w-md space-y-5">
        {!isLogin ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <button
              onClick={() => (window.location.href = "/")}
              className="mb-5 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-white"
            >
              <span>←</span>
              <span>Kembali ke Beranda</span>
            </button>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Login Admin
              </h1>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                className="w-full rounded-2xl bg-orange-500 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                Login Admin
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Dashboard Admin
                  </h1>
                  <p className="text-sm text-gray-500">
                    Kelola menu & stok produk
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <Plus size={18} />
                <h2 className="text-lg font-bold text-gray-900">
                  {isEditing ? "Edit Produk" : "Tambah Produk"}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Dimsum Ayam"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Kategori Produk
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Dimsum"
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                  />
                </div>

  <div className="grid grid-cols-2 gap-3">
  {/* Harga */}
  <div>
    <label className="mb-2 block text-sm font-medium">
      Harga
    </label>
    <input
      type="number"
      inputMode="numeric"
      placeholder="25000"
      value={form.price === 0 ? "" : form.price}
      onChange={(e) =>
        setForm({
          ...form,
          price: e.target.value === "" ? 0 : Number(e.target.value),
        })
      }
      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
    />
  </div>

  {/* Stock */}
<div>
  <label className="mb-2 block text-sm font-medium">
    Stock
  </label>

  <div className="flex items-center overflow-hidden rounded-2xl border border-gray-200">
    {/* Tombol Minus */}
    <button
      type="button"
      onClick={() =>
        setForm({
          ...form,
          stock: Math.max(0, form.stock - 1),
        })
      }
      className="px-4 py-1 text-lg font-bold"
    >
      −
    </button>

    {/* Input */}
    <input
      type="number"
      inputMode="numeric"
      placeholder="0"
      value={form.stock}
      onChange={(e) =>
        setForm({
          ...form,
          stock: e.target.value === "" ? 0 : Number(e.target.value),
        })
      }
      className="w-full border-x border-gray-200 px-4 py-3 text-center text-sm outline-none"
    />

    {/* Tombol Plus */}
    <button
      type="button"
      onClick={() =>
        setForm({
          ...form,
          stock: form.stock + 1,
        })
      }
      className="px-4 py-1 text-lg font-bold"
    >
      +
    </button>
  </div>

  <p className="mt-1 text-xs text-gray-500">
    Isi 0 jika stok habis
  </p>
</div>
</div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Foto Produk
                  </label>

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
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                  />
                </div>

                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="h-44 w-full rounded-2xl border object-cover"
                  />
                )}

                <button
                  onClick={handleSubmit}
                  className="w-full rounded-2xl bg-black py-3 font-semibold text-white transition hover:opacity-90"
                >
                  {isEditing ? "Update Produk" : "Tambah Produk"}
                </button>
              </div>
            </div>

            {/* Product List */}
            <div className="space-y-4">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="mb-4 h-44 w-full rounded-2xl object-cover"
                    />
                  )}

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Kategori: {item.category}
                    </p>
                    <p className="font-semibold">
                      Rp {item.price.toLocaleString()}
                    </p>
                    <p className="text-sm">
                      Stock: {item.stock <= 0 ? "Habis" : item.stock}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex items-center justify-center gap-2 rounded-2xl border py-3 font-medium"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 py-3 font-medium text-white"
                    >
                      <Trash2 size={16} />
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