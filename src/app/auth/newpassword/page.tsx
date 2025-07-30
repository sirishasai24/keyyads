"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

function NewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordsMatchAndLengthValid, setPasswordsMatchAndLengthValid] = useState(false); // Renamed for clarity
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailId = searchParams.get("email");
    if (emailId) setEmail(emailId);
    else {
      // If no email is found, likely an invalid direct access, redirect or show error
      toast.error("Email not found in the link. Please retry the password reset process.");
      router.push("/auth/forgotpassword"); // Redirect to forgot password page
    }
  }, [searchParams, router]); // Added router to dependency array

  useEffect(() => {
    // Check if passwords match and meet minimum length
    if (newPassword === confirmPassword && newPassword.length >= 8) { // Minimum 8 characters for password strength
      setPasswordsMatchAndLengthValid(true);
    } else {
      setPasswordsMatchAndLengthValid(false);
    }
  }, [confirmPassword, newPassword]);

  const onResetPassword = async () => {
    if (!passwordsMatchAndLengthValid) {
      if (newPassword.length < 8) {
        toast.error("Password must be at least 8 characters long.");
      } else {
        toast.error("Passwords do not match!");
      }
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/newpassword", {
        email,
        newPassword,
      });
      console.log("Password reset response:", response.data);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        router.push("/auth");
      }, 2000);
    } catch (error) { // Use 'any' for broader error handling
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef2fb] p-4">
      <div className="bg-[#2180d3] shadow-2xl rounded-2xl p-8 w-full max-w-md transition-all duration-300">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">
          Reset Your Password
        </h1>

        <div className="space-y-5">
          {/* New Password Field */}
          <div className="relative">
            <label
              htmlFor="newpassword"
              className="block text-sm font-medium text-white mb-1"
            >
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newpassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-transparent rounded-lg bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 hover:border-[#4d97e2]"
              placeholder="Enter new password (min 8 characters)"
              minLength={8} // Add minLength attribute for basic HTML validation
              required
            />
            <button
              type="button"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
            >
              {showNewPassword ? (
                // Eye Icon (visible)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                // EyeOff Icon (hidden)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9 0-1.18.261-2.306.75-3.325M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l18 18"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label
              htmlFor="confirmpassword"
              className="block text-sm font-medium text-white mb-1"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmpassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-transparent rounded-lg bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 hover:border-[#4d97e2]"
              placeholder="Confirm new password"
              minLength={8} // Add minLength attribute
              required
            />
            <button
              type="button"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
            >
              {showConfirmPassword ? (
                // Eye Icon (visible)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                // EyeOff Icon (hidden)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9 0-1.18.261-2.306.75-3.325M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l18 18"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Reset Password Button */}
          <button
            disabled={!passwordsMatchAndLengthValid || loading} // Use the clearer state variable
            onClick={onResetPassword}
            className={`w-full px-4 py-2 font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
              ${
                !passwordsMatchAndLengthValid || loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-white text-[#2180d3] hover:bg-[#aedffc] hover:text-[#0f3a57] hover:scale-105 cursor-pointer focus:ring-[#2180d3]" // Updated hover and focus states
              }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

function NewPasswordPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#eef2fb] p-4 text-[#2180d3] font-semibold">
        Loading...
      </div>
    }>
      <NewPasswordPage />
    </Suspense>
  );
}

export default NewPasswordPageWrapper;