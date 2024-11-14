'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import { Accommodation } from '@/types/accommodation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image'; // For optimized image rendering


// Modal Component
const Modal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">Item added to cart</h2>
        <div className="flex flex-col gap-4">
          <Link
            href="/cart"
            className="px-4 py-2 bg-[#DE8022] text-white rounded hover:bg-[#c46f1b] text-center"
          >
            Go to Cart
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AccommodationDetail: React.FC = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  useEffect(() => {
    if (!id) return;

    const fetchAccommodation = async () => {
      try {
        const { data, error } = await supabase
          .from('accommodations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          setError(error.message);
        } else {
          setAccommodation(data);
        }
      } catch (err) {
        setError('Failed to load accommodation details');
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodation();
  }, [id]);

  const handleAddToCart = () => {
    if (accommodation) {
      // Create a CartItem object based on the accommodation data
      const cartItem: CartItem = {
        ...accommodation, // Spread the accommodation properties
        quantity: 1, // Default quantity when adding to cart
        totalPrice: accommodation.price, // Set totalPrice to the price of the accommodation
        country: accommodation.country, // Assuming location is the country (adjust as needed)
      };

      addToCart(cartItem); // Add the CartItem to the cart
      setShowModal(true); // Show the modal after adding to cart
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!accommodation) return <div>No accommodation found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      

      <div className="">
        {/* Display the first image from the accommodation images */}
        <div className="w-full h-64 relative">
          <img
            src={accommodation.images[0]} // Display the first image
            alt={accommodation.name}
            width={500}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{accommodation.name}</h1>
          

          {/* Room Details */}
          <div className="flex gap-6 text-sm text-gray-500 mb-4">
            <span>{accommodation.rooms} Rooms</span>
            <span>{accommodation.beds} Beds</span>
            <span>{accommodation.bathroom} Wifi</span>
          </div>

          <p className="text-gray-800 mb-6">{accommodation.description}</p>

          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-[#DE8022]">
              ${accommodation.price}/night
            </span>
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-[#DE8022] text-white rounded hover:bg-[#c46f1b]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Render the modal if showModal is true */}
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AccommodationDetail;
