import React from "react";
import Link from "next/link";

export default function MobileNav() {
  return (
    <nav className="bg-blue-200 border-t border-slate-900 text-black fixed bottom-0 left-0 right-0 p-4 shadow-lg z-50 sm:hidden">
      <div className="flex justify-between items-center mx-4">
        <Link href="/" passHref>
          <a className="flex flex-col justify-center items-center">
            {/* Add icon or text here for home */}
            Packages
          </a>
        </Link>
        <Link href="/housing" passHref>
          <a className="flex flex-col justify-center items-center">
            {/* Add icon or text here for housing */}
            Housing
          </a>
        </Link>
        <Link href="/cart" passHref>
          <a className="flex flex-col justify-center items-center">
            {/* Add icon or text here for cart */}
            Cart
          </a>
        </Link>
        <Link href="/profile" passHref>
          <a className="flex flex-col justify-center items-center">
            {/* Add icon or text here for profile */}
            Profile
          </a>
        </Link>
      </div>
    </nav>
  );
}
