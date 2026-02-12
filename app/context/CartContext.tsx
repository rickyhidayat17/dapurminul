"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;

  // ✅ TAMBAHAN UNTUK VARIANT / LEVEL
  variantId?: string;
  level?: string;
}

export interface OrderItem {
  id: string;
  customerName: string;
  customerWA: string;
  address: string;
  items: CartItem[];
  total: number;
  date: string;
}

interface CartContextType {
  cart: CartItem[];
  orderHistory: OrderItem[];
  addToCart: (item: Omit<CartItem, "qty">) => void;
  decreaseQty: (id: number, variantId?: string) => void;
  removeFromCart: (id: number, variantId?: string) => void;
  clearCart: () => void;
  saveOrder: (order: OrderItem) => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderItem[]>([]);

  // LOAD
  useEffect(() => {
    const storedCart = localStorage.getItem("dapurminul_cart");
    const storedOrders = localStorage.getItem("dapurminul_orders");

    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedOrders) setOrderHistory(JSON.parse(storedOrders));
  }, []);

  // SAVE
  useEffect(() => {
    localStorage.setItem("dapurminul_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("dapurminul_orders", JSON.stringify(orderHistory));
  }, [orderHistory]);

  // ✅ FIXED ADD TO CART (SUPPORT VARIANT)
  const addToCart = (item: any) => {
  setCart((prev) => {
    const existing = prev.find(
      (i) =>
        i.id === item.id &&
        (i.variantId ?? "normal") === (item.variantId ?? "normal")
    );

    if (existing) {
      return prev.map((i) =>
        i.id === item.id &&
        (i.variantId ?? "normal") === (item.variantId ?? "normal")
          ? { ...i, qty: i.qty + 1 }
          : i
      );
    }

    return [...prev, { ...item, qty: 1 }];
  });
};

  // ✅ FIXED DECREASE (SUPPORT VARIANT)
  const decreaseQty = (id: number, variantId?: string) => {
  setCart((prev) =>
    prev
      .map((item) =>
        item.id === id &&
        (item.variantId ?? "normal") === (variantId ?? "normal")
          ? { ...item, qty: item.qty - 1 }
          : item
      )
      .filter((item) => item.qty > 0)
  );
};

  // ✅ FIXED REMOVE
  const removeFromCart = (id: number, variantId?: string) => {
  setCart((prev) =>
    prev.filter(
      (item) =>
        !(
          item.id === id &&
          (item.variantId ?? "normal") === (variantId ?? "normal")
        )
    )
  );
};

  const clearCart = () => {
    setCart([]);
  };

  const saveOrder = (order: OrderItem) => {
    setOrderHistory((prev) => [order, ...prev]);
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        orderHistory,
        addToCart,
        decreaseQty,
        removeFromCart,
        clearCart,
        saveOrder,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
