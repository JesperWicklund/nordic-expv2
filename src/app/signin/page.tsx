'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // For App Router in Next.js 13+ using 'app' directory
import { supabase } from '../../../lib/supabaseClient';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Display the error message from Supabase
      setMessage(`Error: ${error.message}`);
    } else {
      // Successfully signed in
      setMessage('Signed in successfully! ');
      // Redirect to /event page after successful sign-in
      router.push('/profile');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Sign In</h2>
  
  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  
  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  
  <button 
    onClick={handleSignIn} 
    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
  >
    Sign In
  </button>
  
  {message && <p className="mt-4 font-bold text-center">{message}</p>}
  
  <p className="mt-4 text-center">
    <a href="/signup" className="text-blue-600 hover:underline">
      Register
    </a>
  </p>
</div>

  );
};

export default SignIn;
