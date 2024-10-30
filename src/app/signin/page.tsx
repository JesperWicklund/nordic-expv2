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
      setMessage('Signed in successfully! Redirecting to events...');
      // Redirect to /event page after successful sign-in
      router.push('/event');
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn}>Sign In</button>
      <p>{message}</p>
      <a href="/signup">Register</a>
    </div>
  );
};

export default SignIn;
