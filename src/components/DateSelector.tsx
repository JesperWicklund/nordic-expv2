import { useState } from "react";
import { useDateContext } from "../context/DateContext"; // Import the custom hook

const DateSelector: React.FC = () => {
  const { selectedStartDate, selectedEndDate, setSelectedStartDate, setSelectedEndDate } = useDateContext(); // Use the context
  const [startDate, setStartDate] = useState<string>(selectedStartDate); // Local state for start date
  const [endDate, setEndDate] = useState<string>(selectedEndDate); // Local state for end date

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    setSelectedStartDate(newStartDate); // Update the context state
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    setSelectedEndDate(newEndDate); // Update the context state
  };

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
            min={startDate}  // Set the min attribute to the selected start date
            onChange={handleEndDateChange}
            className="block w-full border border-gray-900 rounded-xl p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
