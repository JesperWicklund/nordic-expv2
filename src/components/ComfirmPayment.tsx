import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/router

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  isOrderFailed: boolean; // New prop to indicate if the order failed
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message, isOrderFailed }) => {
  const router = useRouter(); // Initialize the router

  // If the modal is not open, return null
  if (!isOpen) return null;

  // Function to handle redirection when "My Bookings" is clicked
  const handleMyBookingsClick = () => {
    router.push("/profile/userbookings"); // Navigate to the user bookings page
    onClose(); // Optionally close the modal when redirected
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-20 z-50">
      <div className="bg-white p-6 rounded-xl w-96 h-96 shadow-lg space-y-4">
        {/* Modal Header */}
        <h2 className="text-2xl font-semibold text-center text-black">
          {isOrderFailed ? "Order Failed" : "Order Completed"}
        </h2>

        {/* Modal Body */}
        <p className="text-center text-gray-700">{message}</p>
        <p className="text-center font-bold text-gray-900">
          Your order number is: xxxxxxxxxx
        </p>

        {/* Modal Buttons */}
        <div className="flex flex-col gap-y-3 items-center justify-center">
          {!isOrderFailed && (
            <button
              onClick={handleMyBookingsClick} // Use the handle function for redirection
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-200"
            >
              My Bookings
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 rounded transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
