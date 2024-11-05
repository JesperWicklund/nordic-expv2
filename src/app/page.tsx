'use client'
import React, { useState } from 'react';
import EventsList from '@/components/EventList';
import Header from '@/components/mobile/Header';
import Tags from '@/components/Tags';

export default function Home() {
  // State to track the selected category
  const [selectedCategory, setSelectedCategory] = useState<string>('All'); 

  return (
    <div>
      <Header />
      <Tags selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} /> {/* Pass state and setter */}
      <div className='p-4'>
        <EventsList selectedCategory={selectedCategory} /> {/* Pass selected category to EventsList */}
      </div>
    </div>
  );
}
