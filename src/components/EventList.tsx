import React, { useEffect, useState } from 'react';
import { fetchEvents } from '@/lib/fetchEvents'; 
import EventCard, { EventCardProps } from './EventCard'; 
import Loader from './Loader';

type EventsListProps = {
  selectedCategory: string;
  selectedCountry: string;
}

export default function EventsList({ selectedCategory, selectedCountry }: EventsListProps) {
  const [events, setEvents] = useState<EventCardProps['event'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      const eventsData = await fetchEvents();

      // Sort events by date (assuming `event.date` exists and is a valid date string)
      const sortedEvents = eventsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setEvents(sortedEvents);
      setLoading(false);
    };

    getEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesCountry = selectedCountry === 'All' || event.country === selectedCountry;
    return matchesCategory && matchesCountry;
  });

  return (
    <div className="flex flex-col items-center mb-20">
      {loading ? (
        <Loader />
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
