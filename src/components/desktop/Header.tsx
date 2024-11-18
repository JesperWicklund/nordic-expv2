import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-blue-600 text-white fixed top-0 left-0 right-0 p-4 shadow-lg z-50 hidden sm:block">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-lg font-semibold">
          Home
        </Link>
        <Link href="/housing" className="text-lg font-semibold">
          Housing
        </Link>
        <Link href="/cart" className="text-lg font-semibold">
          Cart
        </Link>
        <Link href="/profile" className="text-lg font-semibold">
          Profile
        </Link>
      </div>
    </nav>
  );
}
