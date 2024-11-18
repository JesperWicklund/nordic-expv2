'use client'
import React, { useEffect, useState } from 'react';
import { fetchAccommodations } from '@/lib/fetchAccommodations';
import AccommodationCard from '@/components/AccommodationCard';
import Loader from '@/components/Loader';
import { Accommodation } from '@/types/accommodation';

const HousingPage: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>(''); // State for selected country

  useEffect(() => {
    const loadAccommodations = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const data = await fetchAccommodations();
        setAccommodations(data);
        setFilteredAccommodations(data); // Initialize with full data set
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(`Failed to load accommodations: ${error.message}`);
        } else {
          setError('An unknown error occurred. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadAccommodations();
  }, []);

  // Update filtered accommodations when selected country changes
  useEffect(() => {
    if (selectedCountry) {
      setFilteredAccommodations(
        accommodations.filter((acc) => acc.country === selectedCountry)
      );
    } else {
      setFilteredAccommodations(accommodations); // Show all if no country is selected
    }
  }, [selectedCountry, accommodations]);

  return (
    <div className="flex flex-col items-center mb-20 mt-10">
      <h1 className="text-3xl font-bold mb-4">Available Apartments</h1>
      
      {/* Dropdown for country selection */}
      <div className="w-full px-4 mb-4 flex flex-col">
        <label htmlFor="country-select" className="mr-2 font-semibold">
          Filter by Country:
        </label>
        <select
          id="country-select"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="p-2 border rounded border-blue-900"
        >
          <option value="">All Countries</option>
          <option value="Sweden">Sweden</option>
          <option value="Norway">Norway</option>
          <option value="Denmark">Denmark</option>
          <option value="Finland">Finland</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredAccommodations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-screen-lg">
          {filteredAccommodations.map((accommodation) => (
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
