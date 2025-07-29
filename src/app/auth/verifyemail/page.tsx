"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const [token, setToken] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyUserEmail = useCallback(async () => {
    if (!token) return; // Ensure token exists before attempting verification
    try {
      await axios.post("/api/auth/verifyemail", { token });
      setVerified(true);
      toast.success("Email verified successfully!");
    } catch (err) {
      setError(true);
      console.error("Error verifying email:", err); // Use console.error for errors
      toast.error("Email verification failed. The link might be invalid or expired.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      setToken(urlToken);
    } else {
      // If no token is found in the URL, immediately show an error
      setError(true);
      setLoading(false);
      toast.error("Verification link is missing or invalid.");
    }
  }, []);

  useEffect(() => {
    // Only call verifyUserEmail if a token is present
    if (token) {
      verifyUserEmail();
    }
  }, [token, verifyUserEmail]); // `verifyUserEmail` is a dependency because it's a useCallback

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 sm:px-6">
      {loading ? (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-sm sm:max-w-md text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2180d3]">
            Verifying...
          </h1>
          <div className="mt-6 w-10 sm:w-12 h-10 sm:h-12 border-4 border-[#aedffc] border-t-[#2180d3] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">
            Please wait while we verify your link.
          </p>
        </div>
      ) : verified ? (
        <div className="bg-[#eaf5ff] p-6 sm:p-8 rounded-lg shadow-lg max-w-sm sm:max-w-md text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2180d3]">
            Email Verified!
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Your email has been successfully verified.
          </p>
          <Link href="/auth">
            <button className="mt-6 bg-[#2180d3] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#1a68a7] transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#51a7e9]">
              Login
            </button>
          </Link>
        </div>
      ) : error ? (
        <div className="bg-[#ffebeb] p-6 sm:p-8 rounded-lg shadow-lg max-w-sm sm:max-w-md text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#d32121]">
            Oops, Something went wrong!
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Please check the link or try again later.
          </p>
          {/* Optional: Add a link to resend verification email or go back to login */}
          <Link href="/auth">
            <button className="mt-6 bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400">
              Go to Login
            </button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}