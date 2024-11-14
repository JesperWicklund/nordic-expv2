import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <nav className="bg-blue-600 text-white fixed top-0 left-0 right-0 p-4 shadow-lg z-50 hidden sm:block">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-lg font-semibold">
          Home
        </Link>
        <Link href="/about" className="text-lg font-semibold">
          About
        </Link>
        <Link href="/contact" className="text-lg font-semibold">
          Contact
        </Link>
      </div>
    </nav>
  )
}
