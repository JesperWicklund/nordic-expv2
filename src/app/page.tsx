"use client";
import React, { useState, useEffect } from "react";
import EventsList from "@/components/EventList";
import Header from "@/components/mobile/Header";
import Tags from "@/components/Tags";
import CountryDropdown from "@/components/mobile/CountryDropDown";


export default function Home() {
  // State to track the selected category, country, and dates
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
 
 

  return (
    <div>
      <Header />
      <CountryDropdown
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />

      

      <div className="mt-8 flex flex-col justify-center items-center">
        <div>
          <h1 className="font-bold text-xl">Packages</h1>
        </div>
        <div>
          <p className="font-light">Ready to go travel packages</p>
        </div>
        <button className="text-[#DE8022] font-semibold">Learn more</button>
      </div>

      {/* Category Dropdown */}
      <Tags
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Pass selected country and dates to EventsList */}
      <div className="p-4">
        <EventsList
          selectedCategory={selectedCategory}
          selectedCountry={selectedCountry}
        />
      </div>
    </div>
  );
}
