"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useDateContext } from "@/context/DateContext";
import { useRouter } from "next/navigation";
import { FaSignOutAlt, FaUserCog, FaClipboardList } from "react-icons/fa"; // React icons for better UX

type User = {
  email?: string;
  name?: string;
  id?: string;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const { clearCart } = useCart();
  const { clearDates } = useDateContext(); // Call the hook at the top level
  const router = useRouter();

  useEffect(() => {
    const getUserSession = async () => {
      setLoading(true); // Start loading
      const { data } = await supabase.auth.getSession();
      const loggedInUser = data?.session?.user;

      if (loggedInUser) {
        const { data: userData, error } = await supabase
          .from("users")
          .select("name")
          .eq("id", loggedInUser.id)
          .single();

        if (userData) {
          setUser({ ...loggedInUser, name: userData.name });
        } else {
          console.error(error?.message || "Error fetching user data");
          setUser(loggedInUser);
        }
      } else {
        setUser(null);
      }

      setLoading(false); // Stop loading after session check
    };

    getUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoading(false); // Stop loading when session state changes
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
    try {
      // Show loading state (you could add a loading state for the button or screen)
      setLoading(true);
  
      // Sign out using Supabase
      await supabase.auth.signOut();
  
      // Clear cart and dates (make sure these functions are working properly)
      clearCart();
      clearDates();
  
      // Optionally, you could navigate the user after sign-out (to home or sign-in page)
      router.push("/signin");
  
      // Clear user state
      setUser(null);
  
    } catch (error) {
      console.error("Sign out error:", error);
      // Optionally, show an error message to the user
      alert("An error occurred while signing out. Please try again.");
  
    } finally {
      // Stop loading state after sign-out attempt
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Profile
      </h2>
      {loading ? ( // Show loader while checking session
        <div className="flex justify-center items-center">
          <div className="loader"></div> {/* Custom loader here */}
        </div>
      ) : user ? (
        <>
          <p className="text-lg text-gray-700 mb-6 text-center">
            Hello, <span className="font-bold text-blue-600">{user.name}</span>
          </p>
          <div className="flex flex-col items-center mb-6 space-y-4">
            <Link
              href="/profile/userbookings"
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-300"
            >
              <FaClipboardList className="mr-2" />
              <span>My Bookings</span>
            </Link>
            <Link
              href="/profile/settings"
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-300"
            >
              <FaUserCog className="mr-2" />
              <span>Settings</span>
            </Link>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center justify-center"
          >
            <FaSignOutAlt className="mr-2 text-gray-600" />
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
