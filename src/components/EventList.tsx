'use client';
import React, { useEffect, useState } from 'react';
import { fetchEvents } from '@/lib/fetchEvents'; 
import EventCard, { EventCardProps } from './EventCard'; // Import the interface here

export default function EventsList() {
  const [events, setEvents] = useState<EventCardProps['event'][]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true); // Start loading
      const eventsData = await fetchEvents();
      setEvents(eventsData);
      setLoading(false); // End loading
    };

    getEvents();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {loading ? ( // Show loader while loading
        <div className="flex justify-center items-center h-48">
          <div className="loader border-t-transparent border-solid border-[#DE8022] border-4 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-screen-lg"> {/* Set max width for the grid */}
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p>No events available</p>
      )}
    </div>
  );
}
