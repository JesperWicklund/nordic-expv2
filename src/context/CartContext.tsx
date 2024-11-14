'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Event } from '@/types/event'; // Assuming you have an Event type
import { Accommodation } from '@/types/accommodation'; // Assuming you have an Accommodation type

// Define a cart item type that can hold either an Event or an Accommodation, along with quantity and price
type CartItem = (Event | Accommodation) & {
  quantity: number;
  totalPrice: number;
  country: string;
};

type CartContextType ={
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateItemQuantity: (id: string, newQuantity: number) => void;
  clearCart: () => void;
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
        // If item already exists, update the quantity and total price
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        updatedCart[existingItemIndex].totalPrice += item.totalPrice;
        return updatedCart;
      } else {
        // If item doesn't exist, add it to the cart with quantity and total price
        return [...prevCart, item];
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

  // Update item quantity in the cart
  const updateItemQuantity = (id: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id.toString() === id ? { ...item, quantity: newQuantity, totalPrice: item.totalPrice / item.quantity * newQuantity } : item
      )
    );
  };

  // Clear the cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateItemQuantity, clearCart }}>
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
