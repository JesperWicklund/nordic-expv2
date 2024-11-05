'use client'
import React, { useState } from 'react';
import EventsList from '@/components/EventList';
import Header from '@/components/mobile/Header';
import Tags from '@/components/Tags';
import CountryDropdown from '@/components/mobile/CountryDropDown'; 

export default function Home() {
  // State to track the selected category and country
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All'); // State for selected country

  return (
    <div>
      <Header />
      <CountryDropdown selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} /> {/* Dropdown for country */}
      <Tags selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <div className='p-4'>
        <EventsList selectedCategory={selectedCategory} selectedCountry={selectedCountry} /> {/* Pass selected country to EventsList */}
      </div>
    </div>
  );
}
