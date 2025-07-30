"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    AiOutlineMail,
    AiOutlinePhone,
    AiOutlineCalendar,
    AiOutlineEdit,
} from "react-icons/ai";
import { BiLogOut, BiBuilding } from "react-icons/bi";
import { MdVerified } from "react-icons/md";
import { FiCamera } from "react-icons/fi";

interface UserProfile {
    username: string;
    email: string;
    phone?: string;
    phoneVerified?: boolean;
    profileImageURL?: string;
    role?: string;
    createdAt?: string;
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
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setImagePreview(reader.result);
                try {
                    setUploading(true);
                    const res = await axios.post("/api/user/upload", {
                        image: reader.result,
                    });
                    setUser((prev) =>
                        prev ? { ...prev, profileImageURL: res.data.secure_url } : prev
                    );
                } catch (err) {
                    console.error("Upload failed", err);
                } finally {
                    setUploading(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        // Fetch user profile
        axios
            .get("/api/auth/me")
            .then((res) => {
                setUser(res.data.user);
                setPhoneInput(res.data.user.phone || "");
            })
            .catch((err) => {
                console.error("Profile fetch error:", err);
                router.push("/auth");
            });

        // Fetch user properties
        axios
            .get("/api/user/properties")
            .then((res) => {
                setProperties(res.data.properties);
            })
            .catch((err) => {
                console.error("Properties fetch error:", err);
                // Handle error, e.g., show a message to the user
            });
    }, [router]);

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            router.push("/auth");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const handlePhoneSubmit = async () => {
        try {
            const res = await axios.post("/api/update-phone", { phone: phoneInput });
            setUser((prev) => (prev ? { ...prev, ...res.data.user } : null));
            setEditPhone(false);
        } catch (err) {
            console.error("Phone update error:", err);
        }
    };

    const handleVerifyClick = async () => {
        try {
            await axios.post("/api/request-verification", { phone: user?.phone });
            alert(
                "A verification code has been sent to your phone. Please check it to verify your number."
            );
        } catch (err) {
            console.error("Verification request failed", err);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500 bg-gray-50">
                Loading profile...
            </div>
        );
    }

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
                            className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-md"
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
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

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
                                            <button
                                                onClick={handleVerifyClick}
                                                className="text-sm font-medium text-[#2180d3] hover:text-blue-700 transition"
                                            >
                                                Verify
                                            </button>
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
                                <div
                                    key={property._id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden"
                                >
                                    <img
                                        src={property.images[0] || "/placeholder.jpg"} // Use a placeholder if no image
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
                                        {/* Add more property details here as needed */}
                                    </div>
                                </div>
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
                                    onClick={() => router.push("/list-property")} // Assuming you have a route to list a new property
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