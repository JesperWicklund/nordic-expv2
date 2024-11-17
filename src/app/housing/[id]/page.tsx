"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import { Accommodation } from "@/types/accommodation";
import { useCart, CartItem } from "@/context/CartContext";
import Image from "next/image"; // For optimized image rendering
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const AccommodationDetail: React.FC = () => {
  const { user } = useUser();
  const { id } = useParams();
  const { addToCart, cart, updateItemQuantity } = useCart(); // Ensure you're using the correct hooks from CartContext
  const router = useRouter(); // Initialize the router

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
      // Redirect the user to the sign-in page if they are not logged in
      router.push("/signin");
      return; // Exit the function after redirecting
    }

    if (accommodation) {
      const existingItem = cart.find((item) => item.id === accommodation.id);

      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        };
        if (existingItem.quantity !== updatedItem.quantity) {
          updateItemQuantity(updatedItem.id.toString(), updatedItem.quantity);
        }
      } else {
        const cartItem: CartItem = {
          ...accommodation,
          quantity: 1,
          totalPrice: accommodation.price,
          country: accommodation.country,
        };
        addToCart(cartItem); // Add to cart
      }
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!accommodation) return <div>No accommodation found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div>
        <div className="w-full h-64 relative">
          {accommodation.images && accommodation.images.length > 0 ? (
            <Image
              src={accommodation.images[0]} // Display the first image
              alt={`Image of ${accommodation.name}`}
              width={500}
              height={300}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-gray-300 w-full h-full flex justify-center items-center">
              <span>No image available</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{accommodation.name}</h1>
              <div className="flex flex-col text-sm text-gray-500">
                <div>
                  <p>{accommodation.location}, {accommodation.city}</p>
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

          <div className="border-b-2">
            <p className="text-gray-800 mb-6">{accommodation.description}</p>
          </div>

          <div className="mt-2">
            <h2 className="font-bold">Host</h2>
            <div className="p-1">
              <p className="font-semibold text-lg text-[#DE8022]">{accommodation.host}</p>
            </div>
          </div>

          <div className="flex justify-between items-center w-full bg-[#FFF2E5] border-t border-gray-200">
            <div>
              <p className="font-bold text-lg ml-6">${accommodation.price}</p>
            </div>
            <div>
              <button
                onClick={handleAddToCart}
                className="w-full sm:w-auto text-lg font-semibold text-white rounded-lg bg-[#DE8022]"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetail;
