import React from 'react'

export default function Header() {
  return (
    <nav className="bg-blue-600 text-white fixed top-0 left-0 right-0 p-4 shadow-lg z-50 hidden sm:block">
    <div className="flex justify-between items-center">
      <a href="/" className="text-lg font-semibold">Home</a>
      <a href="/about" className="text-lg font-semibold">About</a>
      <a href="/contact" className="text-lg font-semibold">Contact</a>
    </div>
  </nav>
  )
}
