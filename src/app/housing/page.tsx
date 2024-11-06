'use client'
import React, { useEffect, useState } from 'react';
import { fetchAccommodations } from '@/lib/fetchAccommodations';
import AccommodationCard from '@/components/AccommodationCard';
import Loader from '@/components/Loader';
import { Accommodation } from '@/types/accommodation';


const HousingPage: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAccommodations = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const data = await fetchAccommodations();
        setAccommodations(data);
      } catch (error) {
        setError('Failed to load accommodations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAccommodations();
  }, []);

  return (
    <div className="flex flex-col items-center mb-20">
      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : accommodations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-screen-lg">
          {accommodations.map((accommodation) => (
            <AccommodationCard key={accommodation.id} accommodation={accommodation} />
          ))}
        </div>
      ) : (
        <p>No accommodations available</p>
      )}
    </div>
  );
};

export default HousingPage;
