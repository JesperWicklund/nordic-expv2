'use client';
import { createContext, useContext, useState, useEffect } from "react";

type DateContextType = {
  selectedStartDate: string;
  selectedEndDate: string;
  setSelectedStartDate: (date: string) => void;
  setSelectedEndDate: (date: string) => void;
  clearDates: () => void;
};

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD"

  const [selectedStartDate, setSelectedStartDate] = useState<string>(today); // Default to today's date
  const [selectedEndDate, setSelectedEndDate] = useState<string>(today); // Default end date to start date

  // Load the dates from localStorage only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
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
    setSelectedStartDate(today); // Reset to today's date
    setSelectedEndDate(today);   // Reset to today's date
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
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
