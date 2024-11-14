import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <nav className="bg-blue-600 text-white fixed top-0 left-0 right-0 p-4 shadow-lg z-50 hidden sm:block">
      <div className="flex justify-between items-center">
        <Link href="/" passHref>
          <a className="text-lg font-semibold">Home</a>
        </Link>
        <Link href="/about" passHref>
          <a className="text-lg font-semibold">About</a>
        </Link>
        <Link href="/contact" passHref>
          <a className="text-lg font-semibold">Contact</a>
        </Link>
      </div>
    </nav>
  )
}
