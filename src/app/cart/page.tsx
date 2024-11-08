'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Event } from '@/types/event';
import { Accommodation } from '@/types/accommodation';
import Link from 'next/link';

const CartPage: React.FC = () => {
  const { cart, removeFromCart } = useCart();

  const handleRemoveFromCart = (itemId: string | number) => {
      removeFromCart(itemId.toString());
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
              {item.hasOwnProperty('name') ? (
                // Display accommodation
                <>
                  <h2 className="text-xl font-bold">{(item as Accommodation).name}</h2>
                  <p>{(item as Accommodation).location}</p>
                  <p>{(item as Accommodation).description}</p>
                  <p className="text-lg text-[#DE8022]">
                    ${(item as Accommodation).price}
                  </p>
                </>
              ) : (
                // Display event
                <>
                  <h2 className="text-xl font-bold">{(item as Event).title}</h2>
                  <p>{(item as Event).location}</p>
                  <p>{(item as Event).description}</p>
                  <p className="text-lg text-[#DE8022]">
                    {(item as Event).price.toLowerCase() === 'free' ? 'Free' : `$${(item as Event).price}`}
                  </p>
                </>
              )}
              <button
                onClick={() => handleRemoveFromCart(item.id.toString())}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Remove from Cart
              </button>
            </div>
          ))}
        </div>
      )}
      <Link href="/checkout" className="px-4 py-2 bg-[#DE8022] text-white rounded hover:bg-[#c46f1b]">
        Proceed to Checkout
      </Link>
    </div>
  );
};

export default CartPage;
