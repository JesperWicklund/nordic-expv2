"use client";

import { createContext, useContext, useState, useEffect } from "react";

type DateContextType = {
  selectedStartDate: string;
  selectedEndDate: string;
  setSelectedStartDate: (date: string) => void;
  setSelectedEndDate: (date: string) => void;
  clearDates: () => void;  // Include clearDates in the context type
};

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // States for start and end dates
  const [selectedStartDate, setSelectedStartDate] = useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = useState<string>("");

  // Load the dates from localStorage only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Retrieve from localStorage only when running on the client side
      const storedStartDate = localStorage.getItem("startDate");
      const storedEndDate = localStorage.getItem("endDate");

      if (storedStartDate) {
        setSelectedStartDate(storedStartDate);
      }
      if (storedEndDate) {
        setSelectedEndDate(storedEndDate);
      }
    }
  }, []); // Only run once, when component mounts on the client

  // Save the dates to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedStartDate) {
        localStorage.setItem("startDate", selectedStartDate);
      }
      if (selectedEndDate) {
        localStorage.setItem("endDate", selectedEndDate);
      }
    }
  }, [selectedStartDate, selectedEndDate]); // Save when dates change

  // Clear the dates from state and localStorage
  const clearDates = () => {
    setSelectedStartDate(""); // Reset state
    setSelectedEndDate("");   // Reset state
    localStorage.removeItem("startDate"); // Clear start date from localStorage
    localStorage.removeItem("endDate");   // Clear end date from localStorage
  };

  return (
    <DateContext.Provider
      value={{
        selectedStartDate,
        selectedEndDate,
        setSelectedStartDate,
        setSelectedEndDate,
        clearDates, // Provide clearDates to the context
      }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDateContext = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDateContext must be used within a DateProvider");
  }
  return context;
};
