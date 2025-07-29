"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Effect to extract token and email from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const emailParam = urlParams.get("id"); // Assuming 'id' carries the email

    if (urlToken) setToken(urlToken);
    if (emailParam) setEmail(emailParam);

    if (!urlToken || !emailParam) {
      setError(true);
      setLoading(false);
      toast.error("Missing verification link or email ID.");
    }
  }, []);

  // Effect to verify the token with the backend once the token is set
  useEffect(() => {
    const resetUser = async () => {
      // Only proceed if token is present and not an empty string
      if (!token) {
        setLoading(false); // Stop loading if no token
        return;
      }
      try {
        // Post the token to your backend to verify it
        const response = await axios.post("/api/auth/resetpassword", { token });
        console.log("Reset password API response:", response.data); // Log response data for clarity
        setVerified(true);
        setError(false);
        toast.success("Verification successful! You can now reset your password.");
      } catch (err: any) { // Type 'err' as 'any' for broader error handling
        setError(true);
        setVerified(false); // Ensure verified is false on error
        const errorMessage = err.response?.data?.message || "Failed to verify link. It might be invalid or expired.";
        console.error("Error during link verification:", err);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (token) { // Ensure token is not empty before calling the async function
      resetUser();
    }
  }, [token]); // Dependency array includes 'token' to re-run when token changes

  // Handler to navigate to the new password page
  const onResetPassword = () => {
    // Ensure email is encoded for safe URL transmission
    router.push(`/auth/newpassword?email=${encodeURIComponent(email)}`);
  };

  // Handler to retry the process (e.g., if the user manually changes the URL)
  const onRetry = () => {
    setError(false);
    setLoading(true);
    // Reset token and email to trigger re-evaluation from URL in useEffect
    setToken("");
    setEmail("");
    // A more robust retry might involve redirecting back to forgot password or informing the user to re-request the link.
    // For now, it will simply re-attempt to extract from URL on next render cycle, which might not be ideal if URL is truly bad.
    // Consider guiding the user to "Forgot Password" page instead for a complete retry flow.
    router.push("/auth/forgotpassword"); // Direct user back to request a new link if the current one is bad
    toast("Please request a new password reset link.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h1 className="text-3xl font-semibold text-[#2180d3] mb-4">
            Verifying...
          </h1>
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-[#aedffc] border-t-[#2180d3] animate-spin"></div>
          <p className="mt-4 text-gray-500">
            Please wait while we verify your link.
          </p>
        </div>
      ) : verified ? (
        <div className="bg-[#eaf5ff] p-8 rounded-lg shadow-lg max-w-md text-center transition duration-300">
          <h1 className="text-3xl font-semibold text-[#2180d3]">
            Link Verified!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            You can now proceed to set your new password.
          </p>
          <button
            className="mt-6 bg-[#2180d3] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#1a68a7] transition duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#51a7e9]"
            onClick={onResetPassword}
          >
            Reset Password
          </button>
        </div>
      ) : error ? (
        <div className="bg-[#ffebeb] p-8 rounded-lg shadow-lg max-w-md text-center transition duration-300">
          <h1 className="text-3xl font-semibold text-[#d32121]">
            Invalid or Expired Link
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            className="mt-6 bg-[#d32121] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#a71a1a] transition duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#f05c5c]"
            onClick={onRetry}
          >
            Request New Link
          </button>
        </div>
      ) : null}
    </div>
  );
}