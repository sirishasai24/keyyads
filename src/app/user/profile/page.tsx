"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link for navigation
import {
    AiOutlineMail,
    AiOutlinePhone,
    AiOutlineCalendar,
    AiOutlineEdit,
    AiOutlineStar, // For Premium Badging
} from "react-icons/ai";
import { BiLogOut, BiBuilding } from "react-icons/bi";
import { MdVerified } from "react-icons/md";
import { FiCamera } from "react-icons/fi";
import { FaBoxes, FaCalendarAlt } from "react-icons/fa"; // For listings and shows
import toast from "react-hot-toast"; // Import toast for notifications

// Updated UserProfile interface to include plan details and expiry date
interface UserProfile {
    username: string;
    email: string;
    phone?: string;
    phoneVerified?: boolean;
    profileImageURL?: string;
    role?: string;
    createdAt?: string;
    plan?: "Free" | "Quarterly Plan" | "Half Yearly Plan" | "Annual Plan";
    listings?: number; // Remaining listings
    premiumBadging?: number; // Remaining premium listings
    shows?: number; // Remaining shows
}

interface UserPlan {
    planTitle: "Quarterly Plan" | "Half Yearly Plan" | "Annual Plan";
    startDate: string;
    expiryDate: string;
    listings: number;
    premiumBadging: number;
    shows: number;
    // ... other plan details if you want to display them
}

interface Property {
    _id: string;
    title: string;
    address: string;
    price: number;
    area: number;
    areaUnit: string;
    images: string[];
    // Add other property fields you want to display
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [userPlan, setUserPlan] = useState<UserPlan | null>(null); // State for plan details
    const [phoneInput, setPhoneInput] = useState("");
    const [editPhone, setEditPhone] = useState(false);
    const [properties, setProperties] = useState<Property[]>([]);
    const router = useRouter();

    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
        null
    );

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            setImagePreview(reader.result);
            try {
                setUploading(true);
                toast.loading("Uploading profile image...");
                const res = await axios.post("/api/user/upload", {
                    image: reader.result,
                });
                setUser((prev) =>
                    prev ? { ...prev, profileImageURL: res.data.secure_url } : prev
                );
                toast.success("Profile image updated successfully!");
            } catch (err) {
                console.error("Upload failed", err);
                toast.error("Failed to upload image.");
            } finally {
                setUploading(false);
                toast.dismiss(); // Dismiss the loading toast
            }
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user and plan data from the new endpoint
                const res = await axios.get("/api/user/current-plan");
                
                // Set user data
                setUser(res.data.user);
                setPhoneInput(res.data.user.phone || "");

                // Set plan data if available
                if (res.data.plan) {
                    setUserPlan(res.data.plan);
                } else {
                    setUserPlan(null); // Explicitly set to null if no plan
                }

                const propertiesRes = await axios.get("/api/user/properties");
                setProperties(propertiesRes.data.properties);
            } catch (err) {
                console.error("Data fetch error:", err);
                toast.error("Failed to load profile or properties. Please login again.");
                router.push("/auth");
            }
        };

        fetchUserData();
    }, [router]);

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            toast.success("Logged out successfully!");
            router.push("/auth");
        } catch (err) {
            console.error("Logout failed:", err);
            toast.error("Logout failed. Please try again.");
        }
    };

    const handlePhoneSubmit = async () => {
        try {
            // Basic validation for phone number
            if (!phoneInput || phoneInput.length < 10) {
                toast.error("Please enter a valid phone number.");
                return;
            }

            toast.loading("Updating phone number...");
            const res = await axios.post("/api/user/update-phone", { phone: phoneInput });
            setUser((prev) => (prev ? { ...prev, ...res.data.user } : null));
            setEditPhone(false);
            toast.success("Phone number updated successfully!");
        } catch (err) {
            console.error("Phone update error:", err);
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Failed to update phone number.");
            }
        } finally {
            toast.dismiss(); // Dismiss the loading toast
        }
    };

    // Function to format date as dd/mm/yyyy
    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Function to determine the border color based on the plan
    const getPlanBorderColorClass = (plan: UserProfile['plan']) => {
        switch (plan) {
            case "Quarterly Plan":
                return "border-green-400"; // Emerald green
            case "Half Yearly Plan":
                return "border-purple-400"; // Violet/Purple
            case "Annual Plan":
                return "border-yellow-400"; // Amber/Orange-Yellow
            default:
                return "border-white"; // Default for Free or no plan
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500 bg-gray-50">
                Loading profile...
            </div>
        );
    }

    const planBorderClass = getPlanBorderColorClass(user.plan);

    return (
        <div className="min-h-screen bg-gray-100 py-16 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="relative p-8 text-center bg-[#2180d3] text-white">
                    <button
                        onClick={handleLogout}
                        className="absolute top-4 right-4 text-white hover:text-gray-200 transition"
                        title="Logout"
                    >
                        <BiLogOut className="text-2xl" />
                    </button>
                    <div className="relative w-28 h-28 mx-auto mb-4">
                        <img
                            src={
                                typeof imagePreview === "string"
                                    ? imagePreview
                                    : user.profileImageURL || "/profile.webp"
                            }
                            alt="Profile"
                            className={`w-28 h-28 rounded-full border-4 object-cover shadow-md ${planBorderClass}`} // Apply dynamic border here
                        />
                        <label
                            htmlFor="imageUpload"
                            className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer"
                        >
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            {uploading ? (
                                <span className="text-xs px-2">⏳</span>
                            ) : (
                                <FiCamera className="text-[#2180d3]" />
                            )}
                        </label>
                    </div>
                    <div className="flex flex-col items-center">
                        <h2 className="text-3xl font-bold tracking-tight">
                            {user.username}
                        </h2>
                        <p className="text-sm font-light text-white/80 mt-1">
                            {user.role || "Property Seeker"}
                        </p>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* User Contact and Creation Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-center space-x-4">
                            <AiOutlineMail className="text-2xl text-[#2180d3]" />
                            <div>
                                <p className="text-sm text-gray-500 font-medium">
                                    Email Address
                                </p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <AiOutlineCalendar className="text-2xl text-[#2180d3]" />
                            <div>
                                <p className="text-sm text-gray-500 font-medium">
                                    Account Created
                                </p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {formatDate(user.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Phone Number Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center space-x-4">
                            <AiOutlinePhone className="text-2xl text-[#2180d3]" />
                            <div>
                                <p className="text-sm text-gray-500 font-medium">
                                    Phone Number
                                </p>
                                {!editPhone && user.phone ? (
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-lg font-semibold text-gray-800">
                                            {user.phone}
                                        </p>
                                        {user.phoneVerified ? (
                                            <span className="flex items-center px-2 py-0.5 text-xs font-bold text-green-700 bg-green-100 rounded-full">
                                                <MdVerified className="mr-1" /> Verified
                                            </span>
                                        ) : (
                                            // Verification button is present but will not function without backend OTP setup
                                            <span className="text-sm font-medium text-gray-500">
                                                (Unverified)
                                            </span>
                                        )}
                                        <button
                                            onClick={() => setEditPhone(true)}
                                            className="text-gray-400 hover:text-gray-600 transition"
                                            title="Edit phone number"
                                        >
                                            <AiOutlineEdit />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 mt-1">
                                        <input
                                            type="tel"
                                            value={phoneInput}
                                            onChange={(e) => setPhoneInput(e.target.value)}
                                            placeholder="Enter phone number"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2180d3] transition"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handlePhoneSubmit}
                                                className="flex-1 px-4 py-2 rounded-lg bg-[#2180d3] text-white font-semibold hover:bg-blue-500 transition"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditPhone(false)}
                                                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Plan Details Section */}
                    <div className="border-t border-gray-200 pt-8 mt-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <AiOutlineStar className="text-2xl text-yellow-500" />
                            My Plan
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 font-medium">Current Plan</p>
                                <p className="text-lg font-semibold text-[#2180d3]">{user.plan || "Free"}</p>
                            </div>
                            {userPlan && user.plan !== "Free" && ( // Only show expiry if a paid plan exists
                                <div className="bg-red-50 p-4 rounded-lg shadow-sm">
                                    <p className="text-sm text-gray-600 font-medium">Plan Expires</p>
                                    <p className="text-lg font-semibold text-red-700">
                                        {formatDate(userPlan.expiryDate)}
                                    </p>
                                </div>
                            )}
                            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 font-medium">Listings Left</p>
                                <p className="text-lg font-semibold text-green-700">{user.listings !== undefined ? user.listings : "N/A"}</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 font-medium">Premium Badging Left</p>
                                <p className="text-lg font-semibold text-yellow-700">{user.premiumBadging !== undefined ? user.premiumBadging : "N/A"}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 font-medium">Shows Left</p>
                                <p className="text-lg font-semibold text-purple-700">{user.shows !== undefined ? user.shows : "N/A"}</p>
                            </div>
                        </div>
                        {user.plan === "Free" && (
                            <div className="mt-6 text-center">
                                <Link href="/user/prime">
                                    <button className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-full hover:bg-yellow-600 transition shadow-md">
                                        Upgrade Your Plan
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-4 text-gray-800">
                        <BiBuilding className="text-2xl text-[#2180d3]" />
                        <h3 className="text-xl font-bold">My Properties</h3>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">
                        Your listed properties will appear here. As a property owner, you
                        can manage them from this section.
                    </p>

                    {properties.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <Link href={`/property/${property._id}`} key={property._id}>
                                    <div
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                                    >
                                        <img
                                            src={property.images[0] || "/placeholder.jpg"}
                                            alt={property.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h4 className="text-lg font-semibold text-gray-900 truncate">
                                                {property.title}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {property.address}
                                            </p>
                                            <p className="text-md font-bold text-[#2180d3] mt-2">
                                                ₹{property.price.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {property.area} {property.areaUnit}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-center">
                            <div className="flex flex-col items-center">
                                <BiBuilding className="text-4xl mb-2 text-[#2180d3]" />
                                <p className="italic text-sm">
                                    You haven&apos;t listed any properties yet.
                                </p>
                                <button
                                    onClick={() => router.push("/property/add")}
                                    className="mt-4 px-6 py-2 rounded-lg bg-[#2180d3] text-white font-semibold hover:bg-blue-500 transition shadow"
                                >
                                    List a New Property
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}