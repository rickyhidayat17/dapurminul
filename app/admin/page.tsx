"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  LogOut,
  Pencil,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

import axios from "axios";

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

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

  /* ================= FETCH PRODUCTS ================= */

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(
      collection(db, "products")
    );

    const productList = querySnapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Product[];

    setProducts(productList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= RESET FORM ================= */

  const resetForm = () => {
    setForm(defaultForm);
    setIsEditing(false);
  };

  /* ================= LOGIN ================= */

  const handleLogin = () => {
    if (
      username === "Dapurminul" &&
      password === "@minul2024"
    ) {
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

  /* ================= SUBMIT PRODUCT ================= */

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.price ||
      !form.category
    ) {
      alert(
        "Nama produk, harga, dan kategori wajib diisi"
      );
      return;
    }

    const payload = {
      name: form.name,
      price: Number(form.price),
      image: form.image || "",
      category: form.category,
      stock: Number(form.stock),
    };

    try {
      if (isEditing) {
        const productRef = doc(
          db,
          "products",
          form.id
        );

        await updateDoc(productRef, payload);

        alert("Produk berhasil diupdate");
      } else {
        await addDoc(
          collection(db, "products"),
          payload
        );

        alert("Produk berhasil ditambahkan");
      }

      await fetchProducts();
      resetForm();
    } catch (error) {
      console.log(error);
      alert("Gagal menyimpan produk");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (item: Product) => {
    setForm(item);
    setIsEditing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(
        doc(db, "products", id)
      );

      await fetchProducts();

      alert("Produk berhasil dihapus");
    } catch (error) {
      console.log(error);
      alert("Gagal menghapus produk");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto w-full max-w-md space-y-5">

        {!isLogin ? (
          /* ================= LOGIN PAGE ================= */
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

            <button
              onClick={() =>
                (window.location.href = "/")
              }
              className="mb-5 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700"
            >
              <span>←</span>
              <span>Kembali ke Beranda</span>
            </button>

            <h1 className="mb-6 text-2xl font-bold text-gray-900">
              Login Admin
            </h1>

            <div className="space-y-4">

              {/* Username */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Username
                </label>

                <input
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 pr-12"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2"
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
                className="w-full rounded-2xl bg-orange-500 py-3 font-semibold text-white"
              >
                Login Admin
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ================= HEADER ================= */}

            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <h1 className="text-xl font-bold">
                    Dashboard Admin
                  </h1>
                  <p className="text-sm text-gray-500">
                    Kelola menu & stok produk
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>

            {/* ================= FORM ================= */}

            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">

              <div className="mb-5 flex items-center gap-2">
                <Plus size={18} />
                <h2 className="text-lg font-bold">
                  {isEditing
                    ? "Edit Produk"
                    : "Tambah Produk"}
                </h2>
              </div>

              <div className="space-y-5">

                {/* Nama Produk */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
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
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Kategori Produk
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Dimsum"
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3"
                  />
                </div>

                {/* Harga */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Harga Produk
                  </label>

                  <div className="flex items-center overflow-hidden rounded-2xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          price: Math.max(
                            0,
                            form.price - 1000
                          ),
                        })
                      }
                      className="px-4 py-3"
                    >
                      <Minus size={18} />
                    </button>

                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          price:
                            e.target.value === ""
                              ? 0
                              : Number(
                                  e.target.value
                                ),
                        })
                      }
                      className="w-full border-x border-gray-200 px-4 py-3 text-center outline-none"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          price:
                            form.price + 1000,
                        })
                      }
                      className="px-4 py-3"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Stock Produk
                  </label>

                  <div className="flex items-center overflow-hidden rounded-2xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          stock: Math.max(
                            0,
                            form.stock - 1
                          ),
                        })
                      }
                      className="px-4 py-3"
                    >
                      <Minus size={18} />
                    </button>

                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          stock:
                            e.target.value === ""
                              ? 0
                              : Number(
                                  e.target.value
                                ),
                        })
                      }
                      className="w-full border-x border-gray-200 px-4 py-3 text-center outline-none"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          stock:
                            form.stock + 1,
                        })
                      }
                      className="px-4 py-3"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Isi 0 jika stok habis
                  </p>
                </div>

                {/* Upload Gambar */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Foto Produk
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file =
                        e.target.files?.[0];

                      if (!file) return;

                      try {
                        const data =
                          new FormData();

                        data.append(
                          "file",
                          file
                        );

                        data.append(
                          "upload_preset",
                          "dapurminul"
                        );

                        const res =
                          await axios.post(
                            "https://api.cloudinary.com/v1_1/rickyhidayat/image/upload",
                            data
                          );

                        setForm({
                          ...form,
                          image:
                            res.data
                              .secure_url,
                        });

                        alert(
                          "Upload gambar berhasil"
                        );
                      } catch (error: any) {
                        console.log(
                          error.response?.data ||
                            error
                        );
                        alert(
                          "Upload gambar gagal"
                        );
                      }
                    }}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3"
                  />
                </div>

                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="h-44 w-full rounded-2xl object-cover"
                  />
                )}

                <button
                  onClick={handleSubmit}
                  className="w-full rounded-2xl bg-black py-3 font-semibold text-white"
                >
                  {isEditing
                    ? "Update Produk"
                    : "Tambah Produk"}
                </button>
              </div>
            </div>

            {/* ================= PRODUCT LIST ================= */}

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

                  <h3 className="text-lg font-bold">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.category}
                  </p>

                  <p className="font-semibold">
                    Rp{" "}
                    {Number(
                      item.price
                    ).toLocaleString("id-ID")}
                  </p>

                  <p className="text-sm">
                    Stock:{" "}
                    {item.stock <= 0
                      ? "Habis"
                      : item.stock}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        handleEdit(item)
                      }
                      className="flex items-center justify-center gap-2 rounded-2xl border py-3"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          item.id
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 py-3 text-white"
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