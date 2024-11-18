'use client';
import React, { useState, FormEvent } from "react";
import { supabase } from "../../../../lib/supabaseClient";

// TypeScript interfaces for the form state and messages
type SettingsFormState  = {
  newName: string;
  newEmail: string;
  newPassword: string;
  currentPassword: string;
}

type FeedbackMessage = {
  message: string;
  type: "success" | "error";
}

export default function SettingsPage() {
  const [formState, setFormState] = useState<SettingsFormState>({
    newName: "",
    newEmail: "",
    newPassword: "",
    currentPassword: "",
  });

  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null); // Success/Error feedback

  async function updateName(userId: string, newName: string): Promise<boolean> {
    const { error } = await supabase
      .from("users")
      .update({ name: newName })
      .eq("id", userId);

    if (error) {
      setFeedback({ message: "Error updating name: " + error.message, type: "error" });
      return false;
    }

    return true;
  }

  async function updateEmail(newEmail: string, currentPassword: string): Promise<boolean> {
    const { data, error: userError } = await supabase.auth.getUser();
  
    if (!data || !data.user || userError) {
      setFeedback({ message: "User must be logged in to update email.", type: "error" });
      return false;
    }
  
    // Check the current password by signing in with the existing credentials
    const { error: passwordError } = await supabase.auth.signInWithPassword({
      email: data.user.email!, // Use the current user's email to sign in
      password: currentPassword, // Validate with current password
    });
  
    if (passwordError) {
      setFeedback({ message: "Current password is incorrect.", type: "error" });
      return false;
    }
  
    // Now update the email
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail, // Update the email
    });
  
    if (updateError) {
      setFeedback({ message: "Error updating email: " + updateError.message, type: "error" });
      return false;
    }
  
    return true;
  }
  
  
  
async function updatePassword(newPassword: string): Promise<boolean> {
  const { data: user, error } = await supabase.auth.getUser();

  if (!user) {
    setFeedback({ message: "User must be logged in to update password.", type: "error" });
    return false;
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword, // Update the password
  });

  if (updateError) {
    setFeedback({ message: "Error updating password: " + updateError.message, type: "error" });
    return false;
  }

  return true;
}

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setFeedback(null); // Reset previous feedback messages

  // Get the user with proper null checking
  const { data, error } = await supabase.auth.getUser();

  // Check if user is authenticated
  if (!data || !data.user) {
    setFeedback({ message: "User not logged in.", type: "error" });
    return;
  }

  const userId = data.user.id; // Safely access the user id now

  let success = true;

  if (formState.newName) {
    success = await updateName(userId, formState.newName);
  }

  if (formState.newEmail && formState.currentPassword) {
    success = await updateEmail(formState.newEmail, formState.currentPassword);
  }

  if (formState.newPassword && formState.currentPassword) {
    success = await updatePassword(formState.newPassword);
  }

  if (success) {
    setFeedback({ message: "Settings updated successfully.", type: "success" });
    
  }
}


  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-6">Update Settings</h1>

      {/* Display feedback messages */}
      {feedback && (
        <div
          className={`text-center p-3 mb-4 rounded-lg ${feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="newName" className="text-lg mb-2">Name:</label>
          <input
            type="text"
            id="newName"
            name="newName"
            value={formState.newName}
            onChange={handleInputChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="newEmail" className="text-lg mb-2">Email:</label>
          <input
            type="email"
            id="newEmail"
            name="newEmail"
            value={formState.newEmail}
            onChange={handleInputChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="newPassword" className="text-lg mb-2">New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formState.newPassword}
            onChange={handleInputChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="currentPassword" className="text-lg mb-2">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formState.currentPassword}
            onChange={handleInputChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Update Settings
        </button>
      </form>
    </div>
  );
}
