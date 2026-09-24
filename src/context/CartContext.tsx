import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product } from '../types/product';
import type { ProductWithFarmer } from '../hooks/useBuyerProducts';

export interface CartItem {
  product: ProductWithFarmer;
  quantity_kg: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: ProductWithFarmer, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('farmdirect_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('farmdirect_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: ProductWithFarmer, quantity: number) => {
    setItems(current => {
      const existingItem = current.find(item => item.product.id === product.id);
      if (existingItem) {
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, quantity_kg: item.quantity_kg + quantity }
            : item
        );
      }
      return [...current, { product, quantity_kg: quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(current => current.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(current => 
      current.map(item =>
        item.product.id === productId
          ? { ...item, quantity_kg: quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getCartSubtotal = useCallback(() => {
    return items.reduce((total, item) => total + (item.product.price_per_kg * item.quantity_kg), 0);
  }, [items]);

  const getCartItemCount = useCallback(() => {
    return items.length;
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartSubtotal,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
