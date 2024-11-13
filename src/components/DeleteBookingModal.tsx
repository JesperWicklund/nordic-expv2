import React, { useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onConfirm: (bookingId: number) => void;
  onCancel: () => void;
  bookingId: number;
};

const DeleteBookingModal = ({ isOpen, onConfirm, onCancel, bookingId }: ModalProps) => {
  if (!isOpen) return null; // Don't render modal if it's not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Are you sure you want to delete this booking?</h3>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => onConfirm(bookingId)} // Pass bookingId to confirm handler
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBookingModal;
