'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import Link from 'next/link'

interface User {
  email?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => { 
    const getUserSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data?.session?.user || null) 
    };

    getUserSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null); // Reset user state on sign-out
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile</h2>
  {user ? (
    <>
      <p className="text-gray-700 mb-4">Welcome, <span className="font-bold">{user.email}</span></p>
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

  )
}