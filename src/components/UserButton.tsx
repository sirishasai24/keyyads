"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

let cachedUser: {
  username: string;
  profileImageURL: string;
  role?: string;
} | null = null;

export function UserButton() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    name: "",
    avatar: "",
    role: "N/A",
  });
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const primaryColor = "#2180d3"; // Define the primary color
  const lightPrimaryColor = "#e6f0fa"; // A lighter shade for hover backgrounds

  useEffect(() => {
    const getUser = async () => {
      try {
        if (cachedUser) {
          setUser({
            name: cachedUser.username,
            avatar: cachedUser.profileImageURL,
            role: cachedUser.role || "N/A",
          });
          return;
        }

        const res = await axios.get("/api/auth/me");
        const data = res.data?.user;
        if (data) {
          cachedUser = data;
          setUser({
            name: data.username,
            avatar: data.profileImageURL,
            role: data.role || "N/A",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    getUser();

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      cachedUser = null;
      router.push("/auth");
      toast.success("Logout successful");
    } catch {
      toast.error("Logout failed.");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full border border-zinc-300 bg-zinc-200 flex items-center justify-center text-lg font-semibold cursor-pointer transition-all duration-200 shadow-sm"
        style={{
            borderColor: open ? primaryColor : 'rgb(228 228 231)', // Apply primary color when open
            boxShadow: open ? `0 0 0 2px ${lightPrimaryColor}` : '0 1px 2px 0 rgb(0 0 0 / 0.05)', // Apply ring when open
        }}
        onMouseEnter={(e) => {
            if (!open) {
                e.currentTarget.style.borderColor = primaryColor;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${lightPrimaryColor}`;
            }
        }}
        onMouseLeave={(e) => {
            if (!open) {
                e.currentTarget.style.borderColor = 'rgb(228 228 231)';
                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
            }
        }}
        title="User Menu"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="User Avatar"
            className="rounded-full w-full h-full object-cover"
          />
        ) : (
          user.name.charAt(0)
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-zinc-200 rounded-xl shadow-xl z-20 transform scale-100 animate-dropdown">
          <div className="px-4 py-3 border-b border-zinc-200">
            <p className="font-semibold text-zinc-800">{user.name}</p>
            <p className="text-sm text-zinc-500"> {user.role}</p>
          </div>

          <button
            onClick={() => {
              setOpen(false);
              router.push("/user/profile");
            }}
            className="flex items-center gap-3 w-full text-left px-4 py-2 text-zinc-700 cursor-pointer transition-colors duration-200"
            style={{ '--hover-bg': lightPrimaryColor } as React.CSSProperties} // Use CSS variable for dynamic hover background
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
          >
            <User size={18} /> View Profile
          </button>

          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer transition-colors duration-200"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}