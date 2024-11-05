'use client';
import React from 'react';

const categories = [
  'All',
  'Music',
  'Food',
  'Education',
  'Travel',
  'Science',
  'Sports',
  'Art',
];

interface TagsProps {
  selectedCategory: string; // Current selected category
  setSelectedCategory: (category: string) => void; // Function to update the selected category
}

export default function Tags({ selectedCategory, setSelectedCategory }: TagsProps) {
  return (
    <div className="p-4 mt-4 sm:flex sm:flex-wrap">
      <div className="overflow-x-auto hide-scrollbar">
        <div className="whitespace-nowrap flex items-center sm:flex-wrap sm:gap-y-4 space-x-4  ">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => setSelectedCategory(category)} // Update selected category on click
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
