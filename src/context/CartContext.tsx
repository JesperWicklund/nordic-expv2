'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Event } from '@/types/event'; // Assuming you have an Event type
import { Accommodation } from '@/types/accommodation'; // Assuming you have an Accommodation type

// Define a cart item type that can hold either an Event or an Accommodation
type CartItem = Event | Accommodation;

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load the cart from localStorage when the component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Sync the cart state with localStorage whenever the cart changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Add item to cart function
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id);
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = item; // Update the existing item if already in the cart
        return updatedCart;
      } else {
        return [...prevCart, item]; // Add new item to the cart
      }
    });
  };

  // Remove item from cart function
  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== itemId);
      localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update localStorage
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
