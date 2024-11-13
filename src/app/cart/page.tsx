'use client';
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { Accommodation } from "@/types/accommodation";
import { Event } from "@/types/event"; // Assuming you have an Event type
import { supabase } from "../../../lib/supabaseClient";

// Utility to determine if the item is an accommodation or event
const isAccommodation = (item: Accommodation | Event): item is Accommodation => "name" in item;

const CartPage: React.FC = () => {
  const { cart, removeFromCart } = useCart();
  const { user } = useUser();

  // Handle checkout
  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to proceed with checkout.");
      return;
    }

    try {
      const bookings = cart.map((item) => ({
        user_id: user?.id, // Logged-in user ID
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
  const getTotalPrice = (item: Accommodation | Event, quantity: number): number => {
    if (isAccommodation(item)) {
      // For accommodation, you might need a different price logic
      return parseFloat(item.price) * quantity;
    } else {
      // For event, handle the price dynamically based on quantity
      return item.price.toLowerCase() === "free" ? 0 : item.price * quantity;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 mb-20">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => {
            const quantity = item.quantity || 1; // Assuming each item has a 'quantity' field in cart
            const totalPrice = getTotalPrice(item, quantity);

            return (
              <div
                key={item.id}
                className="border border-gray-300 rounded-lg p-4 shadow-md"
              >
                {isAccommodation(item) ? (
                  <>
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-64 object-cover rounded-xl" // Fixed height for images
                    />
                    <h2 className="text-xl font-bold">{item.name}</h2>
                    <p>{item.location}</p>
                    <p>{item.description}</p>
                    <p className="text-lg text-[#DE8022]">{item.price}</p>
                  </>
                ) : (
                  <>
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <h2 className="text-xl font-bold">{item.title}</h2>
                    <p>{item.location}</p>
                    <p>{item.description}</p>
                    
                  </>
                )}

                {/* Show quantity and total price */}
                <div className="flex items-center space-x-4 mt-2">
                  <span>Quantity: {quantity}</span>
                  <span className="text-lg text-[#DE8022]">Total: ${totalPrice.toFixed(2)}</span>
                </div>

                {/* Remove from Cart button */}
                <button
                  onClick={() => removeFromCart(item.id.toString())}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                  aria-label={`Remove ${
                    isAccommodation(item) ? item.name : item.title
                  } from Cart`}
                >
                  Remove from Cart
                </button>
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
