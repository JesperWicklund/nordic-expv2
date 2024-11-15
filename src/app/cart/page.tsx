"use client";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useDateContext } from "@/context/DateContext"; // Import the DateContext
import { Accommodation } from "@/types/accommodation";
import { Event } from "@/types/event";
import { supabase } from "../../../lib/supabaseClient";
import PaymentForm from "@/components/PaymentForm";
import Image from "next/image";
import ComfirmPayment from "@/components/ComfirmPayment";
import { useState } from "react";

// Utility to determine if the item is an accommodation or event
const isAccommodation = (item: Accommodation | Event): item is Accommodation =>
  "name" in item;

const CartPage = () => {
  const { cart, removeFromCart, updateItemQuantity } = useCart();
  const { user } = useUser();
  const { selectedStartDate, selectedEndDate, clearDates } = useDateContext(); // Access dates from context
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling the modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State to store modal message

  // Helper function to calculate the total price of an item
  const getTotalPrice = (
    item: Accommodation | Event,
    quantity: number
  ): number => {
    if (isAccommodation(item)) {
      return parseFloat(item.price.toString()) * quantity;
    } else {
      return item.price.toLowerCase() === "free"
        ? 0
        : Number(item.price) * quantity;
    }
  };

  // Calculate total price for all items in the cart
  const totalCartPrice = cart.reduce((total, item) => {
    const quantity = item.quantity || 1;
    return total + getTotalPrice(item, quantity);
  }, 0);

  // Handle checkout
  // Handle checkout
  const handleCheckout = async () => {
    if (!user) {
      return;
    }

    try {
      // Prepare the bookings with total_price, quantity, start_date, and end_date
      const bookings = cart.map((item) => {
        const quantity = item.quantity || 1;
        const totalPrice = getTotalPrice(item, quantity); // Calculate total price for each item

        return {
          user_id: user?.id,
          event_id: isAccommodation(item) ? null : item.id,
          accommodation_id: isAccommodation(item) ? item.id : null,
          booking_date: new Date().toISOString(),
          start_date: selectedStartDate, // Add the selected start date
          end_date: selectedEndDate, // Add the selected end date
          total_price: totalPrice, // Add total price for this item
          quantity: quantity, // Include quantity in the booking data
        };
      });

      // Insert bookings into Supabase with total price, quantity, start_date, and end_date
      const { error } = await supabase.from("bookings").insert(bookings);

      if (error) {
        console.error("Error adding bookings:", error.message);
        setModalMessage("There was an error processing your payment.");
        setIsModalOpen(true); // Open modal on error
      } else {
        // Clear the cart after successful checkout
        cart.forEach((item) => removeFromCart(item.id.toString()));
        clearDates(); // Clear the selected dates
        setModalMessage("Checkout successful!");
        setIsModalOpen(true); // Open modal on success
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setModalMessage("There was an error processing your payment. Please try again.");
      setIsModalOpen(true); // Open modal on error
    }
  };

  // Handle quantity change for events
  const handleQuantityChange = (item: Event, newQuantity: number) => {
    if (newQuantity < 1) return; // Don't allow quantity to go below 1
    updateItemQuantity(item.id.toString(), newQuantity); // Convert item.id to a string
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 mb-20">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {/* Display the selected start and end dates */}
          {selectedStartDate && selectedEndDate && (
            <div className="mb-6 p-4 border border-gray-300 rounded-lg">
              <h3 className="text-xl font-semibold">Booking Dates:</h3>
              <p>
                <strong>Start Date:</strong> {selectedStartDate}
              </p>
              <p>
                <strong>End Date:</strong> {selectedEndDate}
              </p>
            </div>
          )}

          {cart
            .sort((a, b) => {
              if (isAccommodation(a) && !isAccommodation(b)) return 1;
              if (!isAccommodation(a) && isAccommodation(b)) return -1;
              return 0;
            })
            .map((item) => {
              const quantity = item.quantity || 1;
              const totalPrice = getTotalPrice(item, quantity);

              return (
                <div key={item.id} className="m-4">
                  {/* Image and Item Details */}
                  <div className="flex gap-2">
                    <div className="h-28">
                      <Image
                        width={500}
                        height={500}
                        src={item.images[0]}
                        alt={isAccommodation(item) ? item.name : item.title}
                        className="w-full h-full object-cover rounded-xl shadow-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        {isAccommodation(item) ? item.name : item.title}
                      </h2>
                      <p>{item.country}</p>
                      {/* Display Beds count only if item is an accommodation */}
                      {isAccommodation(item) && item.beds ? (
                        <p className="text-sm text-gray-600">
                          Beds: {item.beds}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Quantity, Total Price, and Action */}
                  <div className="mt-4 sm:mt-6 w-full">
                    <div className="flex items-center gap-4">
                      {isAccommodation(item) ? null : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item, quantity - 1)
                            }
                            className="px-2 py-1 bg-gray-200 rounded text-gray-700"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span>{quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item, quantity + 1)
                            }
                            className="px-2 py-1 bg-gray-200 rounded text-gray-700"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      )}
                      <p className="text-gray-700">
                        Total Price: ${totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id.toString())}
                      className="text-red-500 rounded-sm mt-2"
                      aria-label={`Remove ${
                        isAccommodation(item) ? item.name : item.title
                      } from Cart`}
                    >
                      Remove from Cart
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Display Total Price */}
      {cart.length > 0 && (
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">Total</h2>
          <p className="text-gray-700">
            Total Price: ${totalCartPrice.toFixed(2)}
          </p>
        </div>
      )}

      {cart.length > 0 && <PaymentForm />}

      {/* Checkout button */}
      {cart.length > 0 && (
        <button
          onClick={handleCheckout}
          className="px-4 py-2 bg-[#DE8022] text-white rounded hover:bg-[#c46f1b] transition duration-200"
        >
          Comfirm Payment
        </button>
      )}
            <ComfirmPayment isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message={modalMessage} />

    </div>
  );
};

export default CartPage;
