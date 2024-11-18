"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import { Accommodation } from "@/types/accommodation";
import { useCart, CartItem } from "@/context/CartContext";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const AccommodationDetail: React.FC = () => {
  const { user } = useUser();
  const { id } = useParams();
  const { addToCart, cart, updateItemQuantity } = useCart();
  const router = useRouter();

  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(false); // Track if the screen is large

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // Check if screen size is larger than or equal to 'lg'
    };

    handleResize(); // Set the initial screen size
    window.addEventListener("resize", handleResize); // Add resize event listener

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup listener
    };
  }, []);

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
      setShowMessage(true);
      setRedirecting(false);

      setTimeout(() => {
        setRedirecting(true);
        setTimeout(() => {
          router.push("/signin");
        }, 1000);
      }, 2000);

      return;
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
        addToCart(cartItem);
      }

      router.push("/cart");
    }
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index); // Change the large image to the clicked thumbnail
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!accommodation) return <div>No accommodation found</div>;

  return (
    <div className="max-w-4xl bg-slate-100  mx-auto mb-24">
      <div>
        <div className="w-full  ">
          {/* Layout for Large Screens: Main Image on the left, Thumbnails on the right */}
          {accommodation.images && accommodation.images.length > 0 ? (
            isLargeScreen ? (
              <div className="flex space-x-6">
                {/* Large Image */}
                <div className="flex-1">
                  <Image
                    src={accommodation.images[currentImageIndex]}
                    alt={`Image of ${accommodation.name}`}
                    width={800}
                    height={500}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>

                {/* Thumbnails */}
                <div className="flex flex-col space-y-4">
                  {accommodation.images.map((image, index) => (
                    <div key={index} onClick={() => handleImageClick(index)}>
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        width={100}
                        height={60}
                        className="w-full h-auto object-cover cursor-pointer border-2 rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Mobile or Small Screen: Display one image at a time
              <Image
                src={accommodation.images[currentImageIndex]}
                alt={`Image of ${accommodation.name}`}
                width={500}
                height={300}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => handleImageClick((currentImageIndex + 1) % accommodation.images.length)}
              />
            )
          ) : (
            <div className="bg-gray-300 w-full h-full flex justify-center items-center">
              <span>No image available</span>
            </div>
          )}
        </div>

        {/* Display on smaller screens: Thumbnails for image navigation */}
        {!isLargeScreen && accommodation.images && accommodation.images.length > 1 && (
          <div className="flex justify-center mt-2">
            {accommodation.images.map((_, index) => (
              <div
                key={index}
                onClick={() => handleImageClick(index)}
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
                className="w-full px-4 py-2 sm:px-6 text-lg font-semibold text-white rounded-md bg-[#DE8022]"
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
