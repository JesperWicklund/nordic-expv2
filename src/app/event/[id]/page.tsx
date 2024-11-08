"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use useParams from next/navigation
import { supabase } from "../../../../lib/supabaseClient"; // Supabase client
import { Event } from "@/types/event";
import Link from "next/link";

const AccommodationDetail: React.FC = () => {
  const { id } = useParams(); // Get the dynamic `id` from URL using `useParams`

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch accommodation data based on `id`
  useEffect(() => {
    if (!id) return; // Don't fetch data if `id` is undefined

    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("events") // Supabase table name
          .select("*") // Select all columns
          .eq("id", id) // Filter by the dynamic `id`
          .single(); // Expecting a single result

        if (error) {
          setError(error.message);
        } else {
          setEvent(data); // Set fetched data to state
        }
      } catch (err) {
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]); // Dependency on `id` to refetch when it changes

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Error state
  }

  if (!event) {
    return <div>No event found</div>; // If no accommodation data is found
  }

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
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetail;
