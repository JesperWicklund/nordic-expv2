'use client'
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient"; 

const SignUp: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSignUp = async () => {
        if (!email || !password) {
            setMessage("Email and password are required.");
            return;
        }

        setIsLoading(true); // Start loading
        setMessage(""); // Clear previous message

        // Step 1: Sign up the user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            setIsLoading(false);
            return;
        }

        // Step 2: Insert user details into the "users" table
        if (data.user) {
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        id: data.user.id, // Use the authenticated user's id
                        email: email,
                        // Add other fields here, like username if applicable
                    }
                ]);

            if (insertError) {
                setMessage(`Sign up successful, but there was an issue saving user details: ${insertError.message}`);
            } else {
                setMessage('Sign up successful! ');
            }
        }

        setIsLoading(false); // End loading
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Sign Up</h2>

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
    onClick={handleSignUp} 
    disabled={isLoading}
    className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-lg 
                ${isLoading ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700'} 
                transition duration-300`}
  >
    {isLoading ? "Signing Up..." : "Sign Up"}
  </button>

  {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
</div>

    );
};

export default SignUp;
