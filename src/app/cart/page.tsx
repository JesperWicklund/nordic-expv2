"use client";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { Accommodation } from "@/types/accommodation";
import { supabase } from "../../../lib/supabaseClient";


const CartPage: React.FC = () => {
  const { cart, removeFromCart } = useCart();
  const { user } = useUser(); 

  const isAccommodation = (
    item: Accommodation | Event
  ): item is Accommodation => "name" in item;

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
        
        cart.forEach((item) => removeFromCart(item.id.toString()));
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 mb-20">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
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
                  <p className="text-lg text-[#DE8022]">{item.price}</p>
                </>
              )}
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
          ))}
        </div>
      )}
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
