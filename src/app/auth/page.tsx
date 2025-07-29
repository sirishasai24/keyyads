"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import Logo from "../../../public/images/plotlogo1.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle, FaGithub } from "react-icons/fa";

const Loader = () => (
  <div className="fixed top-0 left-0 w-full h-full bg-white/80 flex items-center justify-center z-[9999]">
    <div className="w-12 h-12 border-4 border-[#2180d3] border-b-transparent rounded-full animate-spin"></div>
  </div>
);

const inputBaseClass =
  "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2180d3] focus:border-transparent placeholder-gray-400 transition duration-200";

const LoginRegister: React.FC = () => {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [socialLoadingType, setSocialLoadingType] = useState<null | "google" | "github">(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    try {
      await axios.post("/api/auth/signin", loginData);
      toast.success("Login successful!");
      setTimeout(() => router.push("/"), 1000);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    try {
      await axios.post("/api/auth/signup", registerData);
      toast.success("Registration successful!");
      toast.info("Please check your email to verify your account.");
      setIsRegistering(false);
      setRegisterData({ username: "", email: "", password: "" });
    } catch (error) {
      toast.error("Registration failed. Email may already be in use.");
      console.error("Registration error:", error);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const signInWithProvider = async (providerType: "google" | "github") => {
    setSocialLoadingType(providerType);
    const provider = providerType === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const username = user.displayName || user.email?.split("@")[0] || "User";

      await axios.post("/api/auth/save-user", {
        _id: user.uid,
        username,
        email: user.email,
        profileImageURL: user.photoURL,
      });

      toast.success(`Welcome, ${username}!`);
      setTimeout(() => {
        router.push("/user/profile");
      }, 1000);
    } catch (error) {
      toast.error("Sign-in failed. An account may already exist with a different method.");
      console.error("Sign-in error:", error);
    } finally {
      setSocialLoadingType(null);
    }
  };

  const showFullLoader = isLoginLoading || isRegisterLoading || socialLoadingType !== null;

  return (
    <>
      {showFullLoader && <Loader />}
      <div className="flex h-screen overflow-hidden">
        <div
          className="hidden lg:flex w-1/2 h-full bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col justify-center items-center w-full p-10 text-white text-center">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
              Discover Your Dream Place
            </h1>
            <p className="text-lg font-light max-w-md drop-shadow-md">
              Find the perfect property that fits your life and your vision.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f8fafc] px-6 py-10 overflow-y-auto">
          <motion.div
            key={isRegistering ? "register" : "login"}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
          >
            <div className="flex flex-col items-center mb-2">
              <Image src={Logo} alt="Logo" width={100} height={100} />
            </div>

            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
              <h1 className="text-3xl font-bold text-center mb-6 text-[#2e3a47]">
                {isRegistering ? "Create Account" : "Welcome Back!"}
              </h1>

              <AnimatePresence>
                {isRegistering && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4"
                  >
                    <input
                      type="text"
                      placeholder="Username"
                      required
                      value={registerData.username}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, username: e.target.value })
                      }
                      className={inputBaseClass}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={isRegistering ? registerData.email : loginData.email}
                  onChange={(e) =>
                    isRegistering
                      ? setRegisterData({ ...registerData, email: e.target.value })
                      : setLoginData({ ...loginData, email: e.target.value })
                  }
                  className={inputBaseClass}
                />
              </div>

              <div className="mb-4 relative">
                <input
                  type={
                    isRegistering
                      ? registerPasswordVisible
                        ? "text"
                        : "password"
                      : loginPasswordVisible
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  required
                  value={isRegistering ? registerData.password : loginData.password}
                  onChange={(e) =>
                    isRegistering
                      ? setRegisterData({ ...registerData, password: e.target.value })
                      : setLoginData({ ...loginData, password: e.target.value })
                  }
                  className={inputBaseClass}
                />
                <span
                  onClick={() =>
                    isRegistering
                      ? setRegisterPasswordVisible(!registerPasswordVisible)
                      : setLoginPasswordVisible(!loginPasswordVisible)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 cursor-pointer"
                >
                  {isRegistering
                    ? registerPasswordVisible
                      ? "Hide"
                      : "Show"
                    : loginPasswordVisible
                    ? "Hide"
                    : "Show"}
                </span>
              </div>

              {!isRegistering && (
                <div className="text-right mb-4 text-sm">
                  <a
                    href="/auth/forgotpassword"
                    className="text-[#2180d3] hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoginLoading || isRegisterLoading}
                className="w-full bg-[#2180d3] text-white font-semibold p-3 rounded-lg hover:scale-[1.01] transition-transform cursor-pointer hover:bg-[#1a68a7]"
              >
                {isRegistering ? "Register" : "Login"}
              </button>

              <div className="text-center text-sm my-4 text-[#2e3a47]">
                or continue with
              </div>

              <div className="flex justify-center space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => signInWithProvider("google")}
                  disabled={socialLoadingType !== null}
                  className="p-3 rounded-full shadow border border-gray-300 hover:scale-105 transition cursor-pointer bg-white hover:border-[#2180d3]"
                >
                  <FaGoogle className="text-lg text-[#2180d3] hover:text-black" />
                </button>
                <button
                  type="button"
                  onClick={() => signInWithProvider("github")}
                  disabled={socialLoadingType !== null}
                  className="p-3 rounded-full bg-white shadow border border-gray-300 hover:scale-105 transition cursor-pointer hover:border-[#2180d3]"
                >
                  <FaGithub className="text-lg text-[#2180d3] hover:text-black" />
                </button>
              </div>

              <p className="text-center text-m text-[#2e3a47] mt-6">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-[#2180d3] font-medium hover:underline cursor-pointer"
                >
                  {isRegistering ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default LoginRegister;