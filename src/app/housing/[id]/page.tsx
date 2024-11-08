'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import { Accommodation } from '@/types/accommodation';
import { useCart } from '@/context/CartContext'; // Import useCart for adding to the cart
import Link from 'next/link';

const AccommodationDetail: React.FC = () => {
  const { id } = useParams(); // Get the dynamic `id` from URL using `useParams`
  const { addToCart } = useCart(); // Access the addToCart function

  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!accommodation) {
    return <div>No accommodation found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Link href="/housing" className="text-[#DE8022] hover:underline">
          Back to Listings
        </Link>
      </div>
      <div className="border border-gray-300 rounded-lg p-6 shadow-md">
        <h1 className="text-3xl font-bold mb-2">{accommodation.name}</h1>
        <p className="text-lg text-gray-600 mb-4">{accommodation.location}</p>
        <p className="text-gray-800 mb-6">{accommodation.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-[#DE8022]">
            ${accommodation.price}
          </span>

          {/* Button to add to cart */}
          <button
            onClick={() => addToCart(accommodation)} // Add the accommodation to the cart
            className="px-4 py-2 bg-[#DE8022] text-white rounded hover:bg-[#c46f1b]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetail;
