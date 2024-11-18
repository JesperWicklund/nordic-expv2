"use client";

import Link from "next/link";

import { IoIosSearch } from "react-icons/io";
import { MdOutlineHomeWork } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";



export default function MobileNav() {
  

  

  return (
    <nav className="bg-white border-t border-slate-200 text-black fixed bottom-0 left-0 right-0 p-4 shadow-lg z-50 sm:hidden">
      <div className="flex justify-between items-center mx-4">
        <Link href="/" className="flex flex-col justify-center items-center">
          <IoIosSearch className="text-2xl mb-1" />
          <span>Packages</span>
        </Link>
        <Link
          href="/housing"
          className="flex flex-col justify-center items-center"
        >
          <MdOutlineHomeWork className="text-2xl mb-1" />
          <span>Housing</span>
        </Link>
        <Link
          href="/cart"
          className="flex flex-col justify-center items-center"
        >
          <IoCartOutline className="text-2xl mb-1" />
          <span>Cart</span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col justify-center items-center"
        >
          <FaRegCircleUser className="text-2xl mb-1" />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}
