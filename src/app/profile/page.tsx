"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Link from "next/link";

type User = {
  email?: string;
  name?: string;
  id?: string; // Add the user's id to fetch from the users table
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

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
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile</h2>
      {user ? (
        <>
          <p className="text-gray-700 mb-4">
            Welcome, <span className="font-bold">{user.name}</span>
          </p>
          <Link href="/userbookings">
            <p className="text-blue-600 hover:text-blue-800 transition duration-300">
              My Bookings
            </p>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-700 mb-4">You are not signed in.</p>
          <Link
            className="w-full bg-blue-600 text-white text-center py-2 px-2 rounded-lg hover:bg-blue-700 transition duration-300"
            href="/signin"
          >
            Sign In
          </Link>
        </>
      )}
    </div>
  );
}
