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

  const [accommodation, setAccommodation] = useState<Accommodation | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false); // Track the display of the message
  const [redirecting, setRedirecting] = useState(false); // To control the animation state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      // Show the message for 2 seconds and then redirect
      console.log("User is not logged in, showing message...");
      setShowMessage(true);
      setRedirecting(false); // Ensure message starts visible

      // Delay the redirect after the animation message
      setTimeout(() => {
        console.log("Redirecting to sign-in...");
        setRedirecting(true); // Start fading out the message
        setTimeout(() => {
          router.push("/signin"); // Redirect after fade-out (1s)
        }, 1000); // Redirect after the fade-out duration
      }, 2000); // Wait 2 seconds before initiating fade-out

      return; // Exit the function after showing message and redirecting
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

      // Redirect to the cart page after adding to the cart
      router.push("/cart");
    }
  };

  const handleImageClick = () => {
    if (accommodation && accommodation.images) {
      // Cycle to the next image
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % accommodation.images.length
      );
    }
  };
  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index); 
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!accommodation) return <div>No accommodation found</div>;

  return (
    <div className="max-w-4xl mx-auto mb-24">
      <div>
        <div className="w-full h-64 relative ">
          {accommodation.images && accommodation.images.length > 0 ? (
            <Image
              src={accommodation.images[currentImageIndex]} // Display the current image
              alt={`Image of ${accommodation.name}`}
              width={500}
              height={300}
              className="w-full h-full object-cover cursor-pointer" 
              onClick={handleImageClick} 
            />
          ) : (
            <div className="bg-gray-300 w-full h-full flex justify-center items-center">
              <span>No image available</span>
            </div>
          )}
        </div>
        {/* Dot Indicator */}
        {accommodation.images && accommodation.images.length > 1 && (
          <div className="flex justify-center mt-2">
            {accommodation.images.map((_, index) => (
              <div
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 mx-1 rounded-full cursor-pointer ${
                  index === currentImageIndex ? "bg-[#DE8022]" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        )}

        <div className="px-6 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{accommodation.name}</h1>
              <div className="flex flex-col text-sm text-gray-500">
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

          <div className="border-b-2 mt-6">
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

        {/* Sticky Book Div */}
        <div className="w-full bg-[#FFF2E5] border-t border-gray-200 z-10">
          <div className="flex flex-wrap justify-between items-center w-full">
            <div>
              <p className="font-bold text-lg ml-4 sm:ml-6">
                ${accommodation.price}
              </p>
            </div>
            <div className="w-2/4 sm:mt-0">
              <button
                onClick={handleAddToCart}
                className=" w-full px-4 py-2 sm:px-6 text-lg font-semibold text-white rounded-md bg-[#DE8022] "
              >
                Book
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Show the message when the user is not logged in */}
      {showMessage && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#DE8022] text-white p-4 rounded-lg transition-opacity duration-500 ${
            redirecting ? "opacity-0" : "opacity-100"
          }`}
        >
          <p>You must be logged in to book. Redirecting to sign-in...</p>
        </div>
      )}
    </div>
  );
};

export default AccommodationDetail;
