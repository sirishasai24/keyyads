// components/Chatbot.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperPlane,
  FaTimes,
  FaRobot,
  FaUser,
  FaHeadset,
  FaArrowLeft,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);

  // New state for the support form, including phoneNumber
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  // Helper function to format bot responses with clickable links
  const formatResponseWithLinks = (text: string) => {
    const urlRegex = /(\/property\/[a-f0-9]{24})/g;
    return text.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" class="text-blue-500 hover:underline font-medium">${url}</a>`
    );
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    const userMessage = { sender: "user" as const, text: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/chatbot", { message: query });
      const botResponseText = response.data.aiResponse;
      const botMessage = { sender: "bot" as const, text: botResponseText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot API error:", error);
      toast.error("Sorry, something went wrong. Please try again.");
      const errorMessage = {
        sender: "bot" as const,
        text: "I am unable to connect right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast
      .promise(axios.post("/api/chatbot/support", supportForm), {
        loading: "Sending your message...",
        success: "Your message has been sent successfully!",
        error: "Failed to send message. Please try again.",
      })
      .then(() => {
        setShowSupportForm(false);
        setSupportForm({ name: "", email: "", phoneNumber: "", message: "" });
      })
      .catch((err) => console.error(err));
  };

  const chatWindowVariants = {
    hidden: { scale: 0.8, opacity: 0, x: 200, y: 200 },
    visible: {
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
    exit: { scale: 0.8, opacity: 0, x: 200, y: 200 },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-[#2180d3] text-white shadow-lg z-50 hover:bg-[#1a6cb2] transition-colors"
        aria-label="Open chatbot"
      >
        <FaRobot className="text-2xl" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatWindow"
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-24 right-6 w-80 h-[450px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200"
          >
            <header className="bg-[#2180d3] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {showSupportForm && (
                  <button
                    onClick={() => setShowSupportForm(false)}
                    aria-label="Back to chat"
                  >
                    <FaArrowLeft />
                  </button>
                )}
                <h3 className="font-bold text-lg">
                  {showSupportForm
                    ? "Contact Support"
                    : "Keyyards AI Assistant"}
                </h3>
              </div>
              <div className="flex gap-2">
                {!showSupportForm && (
                  <button
                    onClick={() => setShowSupportForm(true)}
                    aria-label="Contact Support"
                    className="p-2 rounded-full bg-gradient-to-r from-[#2180d3] to-[#1a6cb2] text-white shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center"
                  >
                    <FaHeadset className="text-xl animate-pulse" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chatbot"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </header>

            {!showSupportForm ? (
              // Chat Interface
              <main className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                {messages.length === 0 && !isLoading && (
                  <p className="text-center text-gray-400 text-sm">
                    How can I help you today? Ask me about properties for sale
                    or rent!
                  </p>
                )}
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex items-start gap-2 ${
                        msg.sender === "user" ? "justify-end" : ""
                      }`}
                    >
                      {msg.sender === "bot" && (
                        <FaRobot className="text-[#2180d3] mt-1" />
                      )}
                      <div
                        className={`p-3 rounded-xl max-w-[80%] break-words ${
                          msg.sender === "user"
                            ? "bg-[#2180d3] text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formatResponseWithLinks(msg.text),
                          }}
                        />
                      </div>
                      {msg.sender === "user" && (
                        <FaUser className="text-gray-500 mt-1" />
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2"
                    >
                      <FaRobot className="text-[#2180d3] mt-1 animate-pulse" />
                      <div className="p-3 rounded-xl max-w-[80%] bg-gray-100 text-gray-800">
                        Thinking...
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>
            ) : (
              // Support Form Interface
              <main className="flex-1 p-4 overflow-y-auto">
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={supportForm.name}
                      onChange={(e) =>
                        setSupportForm({ ...supportForm, name: e.target.value })
                      }
                      className="w-full mt-1 p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={supportForm.email}
                      onChange={(e) =>
                        setSupportForm({
                          ...supportForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full mt-1 p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={supportForm.phoneNumber}
                      onChange={(e) =>
                        setSupportForm({
                          ...supportForm,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full mt-1 p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      value={supportForm.message}
                      onChange={(e) =>
                        setSupportForm({
                          ...supportForm,
                          message: e.target.value,
                        })
                      }
                      className="w-full mt-1 p-2 border rounded-lg h-32"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full p-2 bg-[#2180d3] text-white rounded-lg hover:bg-[#1a6cb2]"
                  >
                    Send Message
                  </button>
                </form>
              </main>
            )}

            {!showSupportForm && (
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2180d3]"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-[#2180d3] text-white disabled:bg-gray-400"
                  disabled={isLoading}
                >
                  <FaPaperPlane />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
