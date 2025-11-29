'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  coupon: { code: string; discount: number } | null;
  total: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product._id || i.id === product.id);
      if (existing) {
        return prev.map(i => (i.id === product._id || i.id === product.id) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        id: product._id || product.id, 
        title: product.title || product.name, 
        price: product.price, 
        image: product.images?.[0] || product.image || '', 
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    localStorage.removeItem('cart');
  };

  const applyCoupon = (code: string, discount: number) => {
    setCoupon({ code, discount });
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = coupon ? subtotal * (1 - coupon.discount / 100) : subtotal;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, applyCoupon, coupon, total, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);