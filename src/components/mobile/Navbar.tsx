'use client'
import React, { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js'; // Import User type from supabase-js
import { supabase } from '../../../lib/supabaseClient'; // Adjust the path as necessary
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function MobileNav() {
  const router = useRouter(); // Create a router instance
  const [user, setUser] = useState<User | null>(null); // State to hold the current user

  useEffect(() => {
    // Fetch the initial session when the component mounts
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null); // Set the user if a session exists, otherwise set to null
    };

    fetchSession(); // Fetch session on mount

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null); // Update user state on auth state change
    });

    // Clean up subscription on component unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [router]); // Re-run when the router changes

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut(); // Sign out using Supabase

    if (error) {
      console.error("Error signing out:", error.message); // Log any sign-out errors
    } else {
      router.push("/signin"); // Redirect to the sign-in page after successful sign-out
    }
  };

  return (
    <nav className="bg-blue-200 border-t border-slate-900 text-black fixed bottom-0 left-0 right-0 p-4 shadow-lg z-50 sm:hidden">
      <div className="flex justify-between items-center mx-4">
        <a href="/" className="flex flex-col justify-center items-center">
          {/* Add icon or text here for home */}
          Home
        </a>
        <a href="/housing" className="flex flex-col justify-center items-center">
          {/* Add icon or text here for housing */}
          Housing
        </a>
        <a href="/cart" className="flex flex-col justify-center items-center">
          {/* Add icon or text here for cart */}
          Cart
        </a>
        <a href="/profile" className="flex flex-col justify-center items-center">
          {/* Add icon or text here for profile */}
          Profile
        </a>
        
        {/* Conditionally render the sign-out button */}
        {user && (
          <button 
            onClick={handleSignOut} 
            className="flex flex-col justify-center items-center text-red-500">
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}
