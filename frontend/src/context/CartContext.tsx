'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

export type ShippingOption = {
  id: string;
  name: string;
  cost: number;
  deliveryTime: string;
}

type CartContextType = {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  setShipping: (option: ShippingOption) => void; // Adicionado
  coupon: { code: string; discount: number } | null;
  shipping: ShippingOption | null; // Adicionado
  total: number;
  subtotal: number;
  discountValue: number;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [shipping, setShipping] = useState<ShippingOption | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setItems(JSON.parse(saved));
    const savedShipping = localStorage.getItem('shipping');
    if (savedShipping) setShipping(JSON.parse(savedShipping));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('shipping', JSON.stringify(shipping));
  }, [shipping]);

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
    setShipping(null); // Limpar frete se itens mudarem
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setShipping(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('shipping');
  };

  const applyCoupon = (code: string, discount: number) => {
    setCoupon({ code, discount });
  };
  
  const setShippingOption = (option: ShippingOption) => {
    setShipping(option);
  }

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountValue = coupon ? subtotal * (coupon.discount / 100) : 0;
  const total = subtotal - discountValue + (shipping?.cost || 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, applyCoupon, setShipping: setShippingOption, coupon, shipping, total, subtotal, discountValue }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);