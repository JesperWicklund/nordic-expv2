'use client';
import React from 'react';

const countries = [
  'All',
  'Sweden',
  'Finland',
  'Denmark',
  'Norway',
];

type CountryDropdownProps = {
  selectedCountry: string; // Current selected country
  setSelectedCountry: (country: string) => void; // Function to update the selected country
}

export default function CountryDropdown({ selectedCountry, setSelectedCountry }: CountryDropdownProps) {
  return (
    <div className="p-4">
      <label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select a Country:
      </label>
      <select
        id="country-select"
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)} // Update selected country on change
        className="block w-full border border-gray-900 rounded-xl p-2 "
      >
        {countries.map((country, index) => (
          <option key={index} value={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
}
