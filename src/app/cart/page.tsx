"use client";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useDateContext } from "@/context/DateContext";
import { Accommodation } from "@/types/accommodation";
import { Event } from "@/types/event";
import { supabase } from "../../../lib/supabaseClient";
import PaymentForm from "@/components/PaymentForm";
import Image from "next/image";
import ComfirmPayment from "@/components/ComfirmPayment";
import { useState } from "react";
import { format } from "date-fns";

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

  const getTotalPrice = (item: Accommodation | Event, quantity: number): number => {
    if (isAccommodation(item)) {
      return parseFloat(item.price.toString()) * quantity;
    } else {
      return item.price.toLowerCase() === "free"
        ? 0
        : Number(item.price) * quantity;
    }
  };

  const totalCartPrice = cart.reduce((total, item) => {
    const quantity = item.quantity || 1;  // Get quantity for each item (default to 1 if not set)
    return total + getTotalPrice(item, quantity);  // Sum total price for all items
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
    if (!formData.email.trim()) {
      errors.email = "Please enter your email.";
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

  const handleCheckout = async () => {
    if (!validateForm()) {
      setIsModalOpen(false);  // Don't open modal if form is invalid
      return;
    }

    if (!user) {
      setModalMessage("You must be logged in to proceed with checkout.");
      setIsModalOpen(true);
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
      setModalMessage("There was an error processing your payment. Please try again.");
      setIsModalOpen(true);
    }
  };

  const handleQuantityChange = (item: Event, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItemQuantity(item.id.toString(), newQuantity);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 mb-20">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div>
          {selectedStartDate && selectedEndDate && (
            <div className="mb-6 p-4 border border-gray-300 rounded-lg">
              <h3 className="text-xl font-semibold">Booking Dates:</h3>
              <p>
                <strong>Start Date:</strong> {format(new Date(selectedStartDate), "MMMM d, yyyy")}
              </p>
              <p>
                <strong>End Date:</strong> {format(new Date(selectedEndDate), "MMMM d, yyyy")}
              </p>
            </div>
          )}

          {cart.map((item) => {
            const quantity = item.quantity || 1;
            const totalPrice = getTotalPrice(item, quantity);

            return (
              <div key={item.id} className="m-4">
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
                    {isAccommodation(item) && item.beds ? (
                      <p className="text-sm text-gray-600">Beds: {item.beds}</p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 w-full">
                  <div className="flex items-center gap-4">
                    {isAccommodation(item) ? null : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item, quantity - 1)}
                          className="px-2 py-1 bg-gray-200 rounded text-gray-700"
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item, quantity + 1)}
                          className="px-2 py-1 bg-gray-200 rounded text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    )}
                    <p className="text-gray-700">Total Price: ${totalPrice.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id.toString())}
                    className="text-red-500 rounded-sm mt-2"
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cart.length > 0 && (
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">Total</h2>
          <p className="text-gray-700">Total Price: ${totalCartPrice.toFixed(2)}</p>
        </div>
      )}

      {cart.length > 0 && (
        <PaymentForm
          formData={formData}
          formErrors={formErrors}
          onFormChange={(data) => setFormData(data)}
        />
      )}

      {cart.length > 0 && (
        <button
          onClick={handleCheckout}
          className="px-4 py-2 rounded text-white bg-[#DE8022] hover:bg-[#c46f1b] transition duration-200"
        >
          Confirm Payment
        </button>
      )}

      <ComfirmPayment
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default CartPage;
