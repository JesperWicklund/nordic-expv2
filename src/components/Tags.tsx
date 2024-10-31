'use client';
import React, { useState } from 'react';

const categories = [
  'All',
  'Health & Fitness',
  'Fashion',
  'Education',
  'Travel',
  'Food & Drinks',
  'Sports',
  'Art',
];

export default function Tags() {
  // State to track the selected category
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  return (
    <div className="p-4 mt-4 sm:flex sm:flex-wrap ">
      <div className="overflow-x-auto hide-scrollbar">
        <div className="whitespace-nowrap  flex items-center sm:flex-wrap sm:gap-y-4 space-x-4 space-y-2 sm:space-y-0"> {/* Adjust space for wrapping */}
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => setSelectedCategory(category)} // Set the selected category on click
              className={`inline-block px-6 py-1 rounded-full cursor-pointer transition duration-300 
                ${selectedCategory === category 
                  ? 'bg-[#DE8022] text-white font-semibold'  // Active state (orange bg, white text)
                  : 'bg-[#FFF2E5] text-black hover:bg-[#DE8022] font-semibold'} // Inactive state (gray bg, black text)
              `}
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
