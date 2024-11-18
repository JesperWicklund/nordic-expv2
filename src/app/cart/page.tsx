"use client";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useDateContext } from "@/context/DateContext";
import { Accommodation } from "@/types/accommodation";
import { Event } from "@/types/event";
import { supabase } from "../../../lib/supabaseClient";
import PaymentForm from "@/components/PaymentForm";
import ComfirmPayment from "@/components/ComfirmPayment";
import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";

const isAccommodation = (item: Accommodation | Event): item is Accommodation =>
  "name" in item;

const CartPage = () => {
  const { cart, removeFromCart, updateItemQuantity } = useCart();
  const { user } = useUser();
  const { selectedStartDate, selectedEndDate, clearDates } = useDateContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    payment_method: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    payment_method: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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

  const totalCartPrice = cart.reduce((total, item) => {
    const quantity = item.quantity || 1; // Get quantity for each item (default to 1 if not set)
    return total + getTotalPrice(item, quantity); // Sum total price for all items
  }, 0);

  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      phone: "",
      payment_method: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Please enter your name.";
      isValid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailPattern.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = "Please enter your phone number.";
      isValid = false;
    }

    if (!formData.payment_method) {
      errors.payment_method = "Please select a payment method.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true); // Disable the button while submitting

    if (!user) {
      setModalMessage("You must be logged in to proceed with checkout.");
      setIsModalOpen(true);
      setIsSubmitting(false);
      return;
    }

    if (!selectedStartDate || !selectedEndDate) {
      setModalMessage("Please select your booking dates before proceeding.");
      setIsModalOpen(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const bookings = cart.map((item) => {
        const quantity = item.quantity || 1;
        const totalPrice = getTotalPrice(item, quantity);

        return {
          user_id: user?.id,
          event_id: isAccommodation(item) ? null : item.id,
          accommodation_id: isAccommodation(item) ? item.id : null,
          booking_date: new Date().toISOString(),
          start_date: selectedStartDate,
          end_date: selectedEndDate,
          total_price: totalPrice,
          quantity: quantity,
        };
      });

      const { error } = await supabase.from("bookings").insert(bookings);

      if (error) {
        console.error("Error adding bookings:", error.message);
        setModalMessage("There was an error processing your payment.");
      } else {
        cart.forEach((item) => removeFromCart(item.id.toString()));
        clearDates();
        setModalMessage("Checkout successful!");
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error("Checkout error:", error);
      setModalMessage(
        "There was an error processing your payment. Please try again."
      );
      setIsModalOpen(true);
    }

    setIsSubmitting(false); // Enable the button again
  };

  const handleQuantityChange = (item: Event, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItemQuantity(item.id.toString(), newQuantity);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 mb-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Display booking dates */}
          <div className="p-4 border border-gray-300 rounded-lg">
            <h3 className="text-xl font-semibold">Booking Dates:</h3>
            <p>
              <strong>Start Date:</strong>{" "}
              {format(new Date(selectedStartDate), "MMMM d, yyyy")}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {format(new Date(selectedEndDate), "MMMM d, yyyy")}
            </p>
          </div>

          {/* Cart Items */}
          {cart.map((item) => {
            const quantity = item.quantity || 1;
            const totalPrice = getTotalPrice(item, quantity);

            return (
              <div
                key={item.id}
                className="p-4 border-b border-gray-300 rounded-lg"
              >
                <div className="flex gap-6 items-center">
                  {/* Image Section */}
                  <div className=" rounded-lg overflow-hidden">
                    <Image
                      src={
                        isAccommodation(item) ? item.images[0] : item.images[0]
                      }
                      alt={isAccommodation(item) ? item.name : item.title}
                      layout="intrinsic"
                      width={150}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {/* Title and Info */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 ">
                      {isAccommodation(item) ? item.name : item.title}
                    </h2>
                    <p className="text-sm text-gray-500">{item.country}</p>
                    {isAccommodation(item) && item.beds && (
                      <p className="text-sm text-gray-600">Beds: {item.beds}</p>
                    )}
                  </div>

                  {/* Quantity and Price Section */}
                  <div className="flex flex-col items-end space-y-2">
                    {isAccommodation(item) ? null : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(item, quantity - 1)
                          }
                          className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                        >
                          -
                        </button>
                        <span className="text-lg font-semibold text-gray-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item, quantity + 1)
                          }
                          className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  {totalPrice.toFixed(2)}
                </p>
                {/* Remove from Cart Button */}
                <button
                  onClick={() => removeFromCart(item.id.toString())}
                  className="text-red-500 text-sm mt-2 hover:underline"
                >
                  Remove from Cart
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Total Price Display */}
      {cart.length > 0 && (
        <div className="p-4 border-t border-gray-300 mt-6">
          <h2 className="text-xl font-semibold text-gray-800">Total</h2>
          <p className="text-2xl font-semibold text-gray-900">
            ${totalCartPrice.toFixed(2)}
          </p>
        </div>
      )}

      {/* Payment Form */}
      {cart.length > 0 && (
        <PaymentForm
          formData={formData}
          formErrors={formErrors}
          onFormChange={(data) => setFormData(data)}
        />
      )}

      {/* Checkout Button */}
      {cart.length > 0 && (
        <button
          onClick={handleCheckout}
          className="w-full py-3 bg-[#DE8022] text-white rounded-lg text-lg hover:bg-[#c46f1b] transition duration-200 mt-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Confirm Payment"}
        </button>
      )}

      {/* Modal Confirmation */}
      <ComfirmPayment
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default CartPage;
