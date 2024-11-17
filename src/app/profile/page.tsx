"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; // Import the useCart hook
import { useRouter } from "next/navigation"; // Import the useRouter hook

type User = {
  email?: string;
  name?: string;
  id?: string; // Add the user's id to fetch from the users table
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const { clearCart } = useCart(); // Destructure clearCart from the CartContext
  const router = useRouter(); // Create a router instance for navigation

  useEffect(() => {
    const getUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      const loggedInUser = data?.session?.user;

      if (loggedInUser) {
        // Query the "users" table to get the user's name using the user ID
        const { data: userData, error } = await supabase
          .from('users')
          .select('name') // Fetch the name field from the users table
          .eq('id', loggedInUser.id) // Use the authenticated user's ID
          .single(); // .single() to ensure only one result is returned

        if (userData) {
          setUser({ ...loggedInUser, name: userData.name });
        } else {
          console.error(error?.message || "Error fetching user data");
          setUser(loggedInUser); // If there's an issue, still set user (but without name)
        }
      } else {
        setUser(null);
      }
    };

    getUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null); // Reset user state on sign-out
    clearCart(); // Clear the cart on sign-out
    router.push("/"); // Redirect to the homepage
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Profile</h2>
      {user ? (
        <>
          <p className="text-lg text-gray-700 mb-6 text-center">
            Welcome, <span className="font-bold text-blue-600">{user.name}</span>
          </p>
          <div className="flex justify-center mb-6">
            <Link href="/profile/userbookings"   className="text-blue-600 hover:text-blue-800 font-medium transition duration-300">
             
                <p className="text-center">My Bookings</p>
              
            </Link>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-700 transition duration-300 transform hover:scale-105"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <p className="text-lg text-gray-700 mb-6 text-center">
            You are not signed in.
          </p>
          <div className="flex justify-center">
            <Link
              className="w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              href="/signin"
            >
              Sign In
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
