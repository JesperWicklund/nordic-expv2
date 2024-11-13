"use client";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { Accommodation } from "@/types/accommodation";
import { Event } from "@/types/event";
import { supabase } from "../../../lib/supabaseClient";

// Utility to determine if the item is an accommodation or event
const isAccommodation = (item: Accommodation | Event): item is Accommodation =>
  "name" in item;

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateItemQuantity } = useCart(); // Assuming `updateItemQuantity` is provided in context
  const { user } = useUser();

  // Handle checkout
  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to proceed with checkout.");
      return;
    }

    try {
      const bookings = cart.map((item) => ({
        user_id: user?.id,
        event_id: isAccommodation(item) ? null : item.id,
        accommodation_id: isAccommodation(item) ? item.id : null,
        booking_date: new Date().toISOString(),
      }));

      const { error } = await supabase.from("bookings").insert(bookings);

      if (error) {
        console.error("Error adding bookings:", error.message);
      } else {
        cart.forEach((item) => removeFromCart(item.id.toString())); // Remove all items after successful checkout
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
      return parseFloat(item.price) * quantity;
    } else {
      return item.price.toLowerCase() === "free" ? 0 : item.price * quantity;
    }
  };

  // Handle quantity change for events
  const handleQuantityChange = (item: Event, newQuantity: number) => {
    if (newQuantity < 1) return; // Don't allow quantity to go below 1
    updateItemQuantity(item.id.toString(), newQuantity); // Assuming `updateItemQuantity` is a function that updates cart
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
              // Place events first by checking if an item is an event or accommodation
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
                      <img
                        src={item.images[0]}
                        alt={isAccommodation(item) ? item.name : item.title}
                        className="w-full h-full object-cover rounded-xl shadow-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        {isAccommodation(item) ? item.name : item.title}
                      </h2>
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
                    <button
                      onClick={() => removeFromCart(item.id.toString())}
                      className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-200"
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

      {/* Checkout button */}
      <button
        onClick={handleCheckout}
        className="px-4 py-2 bg-[#DE8022] text-white rounded hover:bg-[#c46f1b]"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartPage;
