'use client'
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient"; 


const SignUp: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSignUp = async () => {
        const { error} = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);

        } else {
            setMessage('Check your email for the confirmation link');
        }

};

 return (
    <div>
      <h2>Sign Up</h2>
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
      <button onClick={handleSignUp}>Sign Up</button>
      <p>{message}</p>
    </div>
  );
};

export default SignUp;