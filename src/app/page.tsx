"use client";
import React, { useState, useEffect } from "react";
import EventsList from "@/components/EventList";
import Header from "@/components/mobile/Header";
import Tags from "@/components/Tags";
import CountryDropdown from "@/components/mobile/CountryDropDown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the datepicker styles

export default function Home() {
  // State to track the selected category, country, and dates
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  // UseEffect to load selected dates from localStorage
  useEffect(() => {
    const storedStartDate = localStorage.getItem("startDate");
    const storedEndDate = localStorage.getItem("endDate");
    if (storedStartDate && storedEndDate) {
      setStartDate(new Date(storedStartDate));
      setEndDate(new Date(storedEndDate));
    }
  }, []);

  // Save dates to localStorage whenever they change
  useEffect(() => {
    if (startDate) localStorage.setItem("startDate", startDate.toISOString());
    if (endDate) localStorage.setItem("endDate", endDate.toISOString());
  }, [startDate, endDate]);

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
