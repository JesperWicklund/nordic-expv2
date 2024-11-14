import Link from 'next/link';
import React from 'react';

export interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    location: string;
    images: string[];
    date: string;
    category: string;
    country: string;
    // Add other event fields as needed
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Link 
      href={`/event/${event.id}`} 
      className="relative sm:w-full    flex flex-col mb-4" // Set a fixed width here
    >
      <div className="relative flex-shrink-0"> 
        {/* Category tag positioned at the top-right corner */}
        {event.category && (
          <span className="capitalize absolute top-2 right-2 bg-[#DE8022]  text-white text-xs font-bold py-1 px-4 rounded-xl">
            {event.category}
          </span>
        )}

        {/* Display the first image if available */}
        {event.images.length > 0 && (
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-64 object-cover rounded-xl" // Fixed height for images
          />
        )}
      </div>

      <div className="p-4 flex-grow"> {/* Use flex-grow to ensure this part takes up the remaining space */}
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="text-gray-700 text-sm mt-2 overflow-hidden whitespace-nowrap text-ellipsis">{event.description}</p>
        <p className="text-gray-500 text-xs mt-2">
          {new Date(event.date).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
};

export default EventCard;
