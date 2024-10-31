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
            <button onClick={handleSignUp} disabled={isLoading}>
                {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
            <p>{message}</p>
        </div>
    );
};

export default SignUp;
