import { useState, useEffect } from "react";
import { useDateContext } from "../context/DateContext"; // Import the custom hook

const DateSelector: React.FC = () => {
  const { selectedStartDate, selectedEndDate, setSelectedStartDate, setSelectedEndDate } = useDateContext(); // Use the context
  const today = new Date().toISOString().split("T")[0]; // Get today's date in the format "YYYY-MM-DD"

  // Set the initial state to selected dates, or default to today if undefined
  const [startDate, setStartDate] = useState<string>(selectedStartDate || today);
  const [endDate, setEndDate] = useState<string>(selectedEndDate || startDate); // Default endDate to startDate

  // Helper function to add one day to a given date string
  const addOneDay = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0]; // Return in "YYYY-MM-DD" format
  };

  // Update the start date
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    setSelectedStartDate(newStartDate); // Update the context state
  };

  // Update the end date
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    setSelectedEndDate(newEndDate); // Update the context state
  };

  useEffect(() => {
    // Sync the component state with the context state whenever the context changes
    if (selectedStartDate !== startDate) {
      setStartDate(selectedStartDate || today);
    }
    if (selectedEndDate !== endDate) {
      setEndDate(selectedEndDate || startDate); // Update endDate if startDate changes
    }
  }, [selectedStartDate, selectedEndDate, startDate, endDate, today]);

  return (
    <div className="p-4">
      <div className="flex space-x-4">
        {/* Start Date */}
        <div className="flex flex-col w-full">
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
            Select start date:
          </label>
          <input
            type="date"
            id="start-date"
            name="start-date"
            value={startDate}
            min={today}  // Set the min attribute to today's date
            onChange={handleStartDateChange}
            className="block w-full border border-gray-900 rounded-xl p-2"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col w-full">
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
            Select end date:
          </label>
          <input
            type="date"
            id="end-date"
            name="end-date"
            value={endDate}
            min={addOneDay(startDate)}  // Set the min attribute to one day after the selected start date
            onChange={handleEndDateChange}
            className="block w-full border border-gray-900 rounded-xl p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
