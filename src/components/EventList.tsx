'use client'
import React, { useEffect, useState } from 'react';
import { fetchEvents } from '@/lib/fetchEvents'; 
import EventCard from './EventCard';


export default function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    };

    getEvents();
  }, []);

  return (
    <div>
      {events.length > 0 ? (
        events.map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        <p>No events available</p>
      )}
    </div>
  );
}
