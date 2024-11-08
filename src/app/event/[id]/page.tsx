'use client'; 
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import { Event } from "@/types/event";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";

const EventDetail: React.FC = () => {
  const { id } = useParams(); // Get the event id from URL parameters
  const { addToCart } = useCart(); // Access cart context
  const { user } = useUser(); // Access user from UserContext

  // State for the event data and loading/error state
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch event details based on the event id from URL
  useEffect(() => {
    if (!id) return; // If no id, do not proceed

    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", id)
          .single(); // Fetch a single event by ID

        if (error) {
          setError(error.message); // Set error message if query fails
        } else {
          setEvent(data); // Set event data if successful
        }
      } catch (err) {
        setError("Failed to load event details"); // Catch unexpected errors
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchEvent();
  }, [id]); // Fetch data when id changes (on mount or URL change)

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>{error}</div>; // Show error state
  if (!event) return <div>No event found</div>; // Show if no event found

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Link href="/housing" className="text-[#DE8022] hover:underline">
          Back to Listings
        </Link>
      </div>
      <div className="border border-gray-300 rounded-lg p-6 shadow-md">
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <p className="text-lg text-gray-600 mb-4">{event.location}</p>
        <p className="text-gray-800 mb-6">{event.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-[#DE8022]">
            {event.price.toLowerCase() === "free" ? "Free" : `$${event.price}`}
          </span>

          {/* Conditionally render the Add to Cart button based on login status */}
          {user ? (
            <button
              onClick={() => addToCart(event)} // Add event to cart when clicked
              className="px-4 py-2 bg-[#DE8022] text-white rounded hover:bg-[#c46f1b]"
            >
              Add to Cart
            </button>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
              Log in to add to cart
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
