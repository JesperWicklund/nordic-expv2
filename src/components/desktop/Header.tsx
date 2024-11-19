import React from "react";
import Link from "next/link";
import AlgLogo from "@/components/ui/AlgLogo";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineHomeWork } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
export default function Header() {
  return (
    <nav className="bg-[#FFF2E5]  fixed top-0 left-0 right-0 p-4 shadow-lg z-50 hidden sm:block">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <AlgLogo />
          <div className="flex flex-col font-bold">
            <p>Nordic</p>
            <p>Experiences</p>
          </div>
        </div>
        <div className="flex gap-6">
          <Link href="/" className="flex  justify-center items-center gap-2">
            <IoIosSearch className="text-2xl" />
            <span>Packages</span>
          </Link>
          <Link href="/housing" className="flex  justify-center items-center gap-2">
            <MdOutlineHomeWork className="text-2xl " />
            <span>Housing</span>
          </Link>
          <Link href="/cart" className="flex  justify-center items-center gap-2">
            <IoCartOutline className="text-2xl " />
            <span>Cart</span>
          </Link>
          <Link href="/profile" className="flex  justify-center items-center gap-2">
            <FaRegCircleUser className="text-2xl " />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
