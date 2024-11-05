'use client';
import React, { useEffect, useState } from 'react';
import { fetchEvents } from '@/lib/fetchEvents'; 
import EventCard, { EventCardProps } from './EventCard'; 

interface EventsListProps {
  selectedCategory: string; // Accept selected category as a prop
}

export default function EventsList({ selectedCategory }: EventsListProps) {
  const [events, setEvents] = useState<EventCardProps['event'][]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true); // Start loading
      const eventsData = await fetchEvents();
      setEvents(eventsData);
      setLoading(false); // End loading
    };

    getEvents();
  }, []);

  // Filter events based on selected category
  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  return (
    <div className="flex flex-col items-center">
      {loading ? ( // Show loader while loading
        <div className="flex justify-center items-center h-48">
          <div className="loader border-t-transparent border-solid border-[#DE8022] border-4 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-screen-lg">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p>No events available</p>
      )}
    </div>
  );
}
