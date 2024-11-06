'use client'
// components/AccommodationCard.tsx
import React from 'react';
import Link from 'next/link';
import { Accommodation } from '@/types/accommodation';

type AccommodationCardProps = {
  accommodation: Accommodation;
};

const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation }) => {
  return (
    <Link href={`/housing/${accommodation.id}`}>
      <div className="block border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
        <h2 className="text-lg font-bold mb-2">{accommodation.name}</h2>
        <p className="text-sm text-gray-600 mb-4">{accommodation.location}</p>
        <p className="text-gray-800 mb-4">{accommodation.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-[#DE8022]">
            ${accommodation.price.toFixed(2)}
          </span>
          
        </div>
      </div>
    </Link>
  );
};

export default AccommodationCard;
