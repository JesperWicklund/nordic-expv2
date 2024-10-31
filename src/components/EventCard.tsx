import React from 'react';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    location: string;
    images: string[];
    date: string;
    category: string;
    // Add other event fields as needed
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="relative max-w-sm border rounded-lg overflow-hidden shadow-lg mx-auto">
      <div className="relative">
        {/* Category tag positioned at the top-right corner */}
        {event.category && (
          <span className="capitalize absolute top-2 right-2 bg-[#DE8022] bg-opacity-70 text-white text-xs font-bold py-1 px-4 rounded-xl">
            {event.category}
          </span>
        )}

        {/* Display the first image if available */}
        {event.images.length > 0 && (
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="text-gray-700 text-sm mt-2">{event.description}</p>
        <p className="text-gray-500 text-xs mt-2">
          {new Date(event.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
