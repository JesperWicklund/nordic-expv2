'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";

import { IoIosSearch } from "react-icons/io";
import { MdOutlineHomeWork } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { supabase } from "../../../lib/supabaseClient";

type User = {
  email?: string;
  name?: string;
  id?: string;
};

export default function MobileNav() {
 
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUserSession = async () => {
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

  return (
    <nav className="bg-white border-t border-slate-200 text-black fixed bottom-0 left-0 right-0 p-4 shadow-lg z-50 sm:hidden">
      <div className="flex justify-between items-center mx-4">
        <Link href="/" className="flex flex-col justify-center items-center">
          <IoIosSearch className="text-2xl mb-1" />
          <span>Packages</span>
        </Link>
        <Link href="/housing" className="flex flex-col justify-center items-center">
          <MdOutlineHomeWork className="text-2xl mb-1" />
          <span>Housing</span>
        </Link>
        <Link href="/cart" className="flex flex-col justify-center items-center">
          <IoCartOutline className="text-2xl mb-1" />
          <span>Cart</span>
        </Link>
        <Link href="/profile" className="flex flex-col justify-center items-center">
          {user ? (
            <>
              <FaRegCircleUser className="text-2xl mb-1" />
              <span>{user.name}</span> {/* Assuming user object has a `name` field */}
            </>
          ) : (
            <>
              <FaRegCircleUser className="text-2xl mb-1" />
              <span>Profile</span>
            </>
          )}
        </Link>
      </div>
    </nav>
  );
}
