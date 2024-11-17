"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import { Accommodation } from "@/types/accommodation";
import { useCart, CartItem } from "@/context/CartContext";

import Image from "next/image"; // For optimized image rendering
import { useUser } from "@/context/UserContext";

// Modal Component

const AccommodationDetail: React.FC = () => {
  const { id } = useParams();
  const { addToCart, cart, updateItemQuantity } = useCart(); // Ensure you're using the correct hooks from CartContext
  const user = useUser();

  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAccommodation = async () => {
      try {
        const { data, error } = await supabase
          .from("accommodations")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          setError(error.message);
        } else {
          setAccommodation(data);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Failed to load accommodations: ${err.message}`);
        } else {
          setError("An unknown error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodation();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      console.error("User is not logged in. This action is not allowed.");
      return; // Exit the function early if the user is not logged in
    }

    if (accommodation) {
      // Check if the accommodation is already in the cart
      const existingItem = cart.find((item) => item.id === accommodation.id);

      if (existingItem) {
        // If the item is already in the cart, just update the quantity
        const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
        updateItemQuantity(updatedItem.id.toString(), updatedItem.quantity); // Update the cart context
      } else {
        // If it's not in the cart, add it with quantity 1
        const cartItem: CartItem = {
          ...accommodation,
          quantity: 1, // Initial quantity is 1
          totalPrice: accommodation.price, // Price should be set correctly
          country: accommodation.country,
        };

        addToCart(cartItem); // Add to cart
      }
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
          <Image
            src={accommodation.images[0]} // Display the first image
            alt={accommodation.name}
            width={500}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold ">{accommodation.name}</h1>
              <div className="flex flex-col text-sm text-gray-500 ">
                <div>
                  <p>
                    {accommodation.location}, {accommodation.city}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span>Rooms: {accommodation.rooms}</span>
                  <span>Beds: {accommodation.beds}</span>
                  <span>Wifi: {accommodation.wifi ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-md font-semibold text-[#DE8022]">
                ${accommodation.price}/night
              </p>
            </div>
          </div>
          <div>
            <div className="border-b-2">
              <p className="text-gray-800 mb-6">{accommodation.description}</p>
            </div>
            <div className="mt-2">
              <h2 className="font-bold">Host</h2>
              <div className="p-1">
                <p className="font-semibold text-lg text-[#DE8022]">
                  {accommodation.host}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center  w-full bg-[#FFF2E5] border-t border-gray-200 sm:hidden">
            <div>
              <p className="font-bold text-lg ml-6"> ${accommodation.price}</p>
            </div>
            <div>
              <button
                onClick={user ? handleAddToCart : undefined}
                disabled={!user || loading} // Disable if loading or user is not logged in
                className={`w-full sm:w-auto px-6 py-3 text-lg font-semibold text-white rounded-lg shadow-md transition-all duration-200 ${
                  loading || !user
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#DE8022] hover:bg-[#c46f1b]"
                }`}
              >
                {loading
                  ? "Checking login status..."
                  : user
                  ? "Book"
                  : "Log in to book"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetail;
