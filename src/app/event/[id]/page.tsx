"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import { Event } from "@/types/event";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

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
          <Link
            href="/housing"
            className="px-4 py-2 bg-[#DE8022] text-white rounded hover:bg-[#c46f1b] text-center"
          >
            See Available Apartments
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

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useUser();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          setError(error.message);
        } else {
          setEvent(data);
        }
      } catch (err) {
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleIncrease = () => {
    setTicketCount((prevCount) => prevCount + 1);
  };

  const handleDecrease = () => {
    if (ticketCount > 1) {
      setTicketCount((prevCount) => prevCount - 1);
    }
  };

  const handleAddToCart = () => {
    if (event) {
      addToCart({ ...event, quantity: ticketCount, totalPrice });
      setShowModal(true); // Show the modal after adding to cart
    }
  };

  const totalPrice =
    event?.price.toLowerCase() === "free"
      ? 0
      : Number(event?.price) * ticketCount;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!event) return <div>No event found</div>;

  return (
    <div className="max-w-4xl mb-20 mx-auto p-4 ">
      <div className="mb-6">
        <Image
          width={500}
          height={500}
          src={event.images[0]}
          alt={event.title}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <span className="text-lg font-semibold text-[#DE8022]">
          {event.days} days
        </span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <p>${event.price}</p>
        <div className="flex items-center">
          <span className="text-slate-700">★★★★☆</span>
          <span className="ml-2 text-gray-600">({event.rating})/5</span>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{event.description}</p>

      <div className="mb-4">
        <h2 className="font-semibold text-lg mb-2">Highlights:</h2>
        <div className="flex gap-4 mb-4">
          <span className="px-4 py-2 bg-gray-200 rounded-full text-sm">
            Guided tour
          </span>
          <span className="px-4 py-2 bg-gray-200 rounded-full text-sm">
            Museum
          </span>
          <span className="px-4 py-2 bg-gray-200 rounded-full text-sm">
            Monumental Sight
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold text-lg mb-2">Locations:</h2>
        <div className="w-full h-32 bg-gray-200 rounded-lg">
          {/* Map placeholder or actual map iframe here */}
        </div>
      </div>

      {/* Ticket quantity controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <p className="text-xl text-gray-800">
          {event.price.toLowerCase() === "free"
            ? "Free"
            : `$${totalPrice.toFixed(2)}`}
        </p>
        <button
          onClick={handleDecrease}
          className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-l-lg hover:bg-gray-300 focus:outline-none transition-all duration-200 ease-in-out"
        >
          -
        </button>
        <span className="px-6 py-2 text-xl font-semibold text-gray-800 bg-gray-100 rounded-md shadow-inner">
          {ticketCount}
        </span>
        <button
          onClick={handleIncrease}
          className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-r-lg hover:bg-gray-300 focus:outline-none transition-all duration-200 ease-in-out"
        >
          +
        </button>
      </div>

      {/* Book Button */}
      {user ? (
        <button
          onClick={handleAddToCart}
          className="w-full sm:w-auto px-6 py-3 text-lg font-semibold text-white bg-[#DE8022] rounded-lg shadow-md hover:bg-[#c46f1b] focus:outline-none transition-all duration-200 ease-in-out"
        >
          Book
        </button>
      ) : (
        <Link
          href="/login"
          className="w-full sm:w-auto px-6 py-3 text-lg font-semibold text-white bg-gray-400 rounded-lg shadow-md hover:bg-gray-500 focus:outline-none transition-all duration-200 ease-in-out text-center"
        >
          Log in to book
        </Link>
      )}

      {/* Render the modal if showModal is true */}
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default EventDetail;
