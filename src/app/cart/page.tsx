"use client";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { Accommodation } from "@/types/accommodation";
import { Event } from "@/types/event";
import { supabase } from "../../../lib/supabaseClient";
import PaymentForm from "@/components/PaymentForm";
import Image from "next/image";

// Utility to determine if the item is an accommodation or event
const isAccommodation = (item: Accommodation | Event): item is Accommodation =>
  "name" in item;

interface CartPageProps {
  startDate: Date | null;
  endDate: Date | null;
}

const CartPage: React.FC<CartPageProps> = ({ startDate, endDate }) => {
  const { cart, removeFromCart, updateItemQuantity } = useCart();
  const { user } = useUser();

  // Handle checkout
  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to proceed with checkout.");
      return;
    }

    try {
      // Calculate total price for all items in the cart
      const totalCartPrice = cart.reduce((total, item) => {
        const quantity = item.quantity || 1;
        return total + getTotalPrice(item, quantity);
      }, 0);

      // Prepare the bookings with total_price and quantity
      const bookings = cart.map((item) => {
        const quantity = item.quantity || 1;
        const totalPrice = getTotalPrice(item, quantity); // Calculate total price for each item

        return {
          user_id: user?.id,
          event_id: isAccommodation(item) ? null : item.id,
          accommodation_id: isAccommodation(item) ? item.id : null,
          booking_date: new Date().toISOString(),
          total_price: totalPrice, // Add total price for this item
          quantity: quantity, // Include quantity in the booking data
        };
      });

      // Insert bookings into Supabase with total price and quantity
      const { error } = await supabase.from("bookings").insert(bookings);

      if (error) {
        console.error("Error adding bookings:", error.message);
      } else {
        // Clear the cart after successful checkout
        cart.forEach((item) => removeFromCart(item.id.toString()));
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

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
                      className="  text-red-500  rounded-sm mt-2"
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
      { cart.length > 0 &&
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">Total</h2>
          <p className="text-gray-700">
            Total Price: $
            {cart
              .reduce((total, item) => {
                const quantity = item.quantity || 1;
                return total + getTotalPrice(item, quantity);
              }, 0)
              .toFixed(2)}
          </p>
        </div>
      }
      {cart.length > 0 && <PaymentForm />}

      {/* Checkout button, displayed only if there are items in the cart */}
      {cart.length > 0 && (
        <button
          onClick={handleCheckout}
          className="px-4 py-2 bg-[#DE8022] text-white rounded hover:bg-[#c46f1b] transition duration-200"
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default CartPage;
