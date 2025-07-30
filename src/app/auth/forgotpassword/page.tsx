"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Ensure Toaster is imported or included in a parent component if needed for 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Timer countdown logic
  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    }
    // Cleanup the timeout if the component unmounts or timer resets
    return () => clearTimeout(countdown);
  }, [timer]);

  const onResetPassword = async () => {
    // Dismiss any specific toast error for empty email if it exists
    toast.dismiss("empty-email-error");

    // Client-side validation for empty email
    if (!email.trim()) {
      toast.error("Please enter your email.", { id: "empty-email-error" });
      return;
    }

    // Prevent multiple submissions or submission during cooldown
    if (loading || timer > 0) return;

    // Reset messages and activate loading state
    setMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/forgotpassword", { email });
      console.log("Forgot password API response:", response.data);
      setMessage("Email sent to reset password"); // Set internal message state
      toast.success("Password reset link sent to your email!"); // User-facing toast notification
      setTimer(30); // Start 30-second cooldown period
    } catch (error) { // Type 'error' as 'any' for flexible error handling
      // Extract specific error message from response or use a generic one
      const errorMsg = error || "Failed to send reset email. Please try again.";
      console.error("Forgot password error:", error);
       // Set internal error message state
      toast.error("Failed to send reset email. Please try again."); // User-facing toast notification
    } finally {
      setLoading(false); // Deactivate loading state regardless of success or failure
    }
  };

  // Determine if the button should be disabled
  const isDisabled = !email.trim() || loading || timer > 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#eef2fb] p-4 sm:p-6">

      <div className="relative w-full max-w-sm sm:max-w-md bg-[#2180d3] rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300">
        <h1 className="text-lg sm:text-2xl font-bold text-center text-white mb-3 sm:mb-4">
          Forgot Password
        </h1>
        <p className="text-sm sm:text-base text-white text-center mb-5 sm:mb-6">
          Enter your email to reset your password
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-4 py-2 rounded-lg bg-white text-gray-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 hover:border-[#4d97e2]"
          aria-label="Email for password reset"
          required
        />

        <button
          onClick={onResetPassword}
          disabled={isDisabled}
          className={`w-full mt-4 py-2 sm:py-3 px-4 font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#51a7e9]
            ${
              isDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-[#2180d3] hover:bg-[#aedffc] hover:text-[#0f3a57] hover:scale-105 cursor-pointer"
            }`}
        >
          {loading
            ? "Sending..."
            : timer > 0
            ? `Resend in ${timer}s`
            : "Reset Password"}
        </button>

        {/* Display messages (toast is usually sufficient for user feedback) */}
        {message && (
          <p className="mt-3 text-sm text-white text-center" role="status">
            {message}
          </p>
        )}
        {errorMessage && (
          <p className="mt-3 text-sm text-red-100 text-center" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}