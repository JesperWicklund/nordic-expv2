'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'



export default function profile() {
  const [user, setUser] = useState(null)

  useEffect(() => { 
    const getUserSession = async () => {
      const {data } = await supabase.auth.getSession()
      setUser(data?.session?.user || null) 
    };

    getUserSession()

    const {data: authListener} = supabase.auth.onAuthStateChange((_event, session) => {
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
    <div>
      <h2>Profile</h2>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <p>You are not signed in.</p>
      )}
    </div>
  )
}
