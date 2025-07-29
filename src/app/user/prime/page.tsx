"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    CheckCircleIcon,
    MinusCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/solid";
import {
    CalendarDaysIcon,
    HomeModernIcon,
    StarIcon,
    BanknotesIcon,
    ShieldCheckIcon,
    ShareIcon,
    ArrowUturnLeftIcon,
    PhoneIcon,
} from "@heroicons/react/24/outline";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface Plan {
    title: string;
    color: string;
    listings: number;
    premiumBadging: number;
    shows: number;
    emi: boolean;
    saleAssurance: boolean;
    socialMedia: boolean;
    moneyBack: boolean | string;
    teleCalling: boolean;
    price: string;
    originalPrice: string;
    note: string;
}

interface ShowMoreState {
    [key: string]: boolean;
}

const plans: Plan[] = [
    {
        title: "Quarterly Plan",
        color: "from-blue-500 to-blue-700",
        listings: 5,
        premiumBadging: 1,
        shows: 1,
        emi: true,
        saleAssurance: false,
        socialMedia: true,
        moneyBack: false,
        teleCalling: false,
        price: "₹8,999/-",
        originalPrice: "₹12,499",
        note: "Inclusive of GST",
    },
    {
        title: "Half Yearly Plan",
        color: "from-emerald-500 to-emerald-700",
        listings: 10,
        premiumBadging: 2,
        shows: 2,
        emi: true,
        saleAssurance: false,
        socialMedia: true,
        moneyBack: false,
        teleCalling: true,
        price: "₹17,999/-",
        originalPrice: "₹26,999",
        note: "Inclusive of GST",
    },
    {
        title: "Annual Plan",
        color: "from-purple-500 to-purple-700",
        listings: 25,
        premiumBadging: 3,
        shows: 4,
        emi: true,
        saleAssurance: true,
        socialMedia: true,
        moneyBack: "Yes (After 6th month)",
        teleCalling: true,
        price: "₹29,988/-",
        originalPrice: "₹44,982",
        note: "Inclusive of GST",
    },
];

const SubscriptionPage = () => {
    const [showMore, setShowMore] = useState<ShowMoreState>({});

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);
    }, []);

    const toggleShowMore = (title: string) => {
        setShowMore((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const handleBuyNow = async (plan: Plan) => {
        const amount = parseInt(plan.price.replace(/[^\d]/g, ""), 10);

        try {
            const res = await axios.post("/api/razorpay/create-order", {
                amount,
                planName: plan.title,
            });

            const order = res.data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: order.amount,
                currency: order.currency,
                name: "RealEstate Pro",
                description: `${plan.title} Subscription`,
                order_id: order.id,
                handler: (response: any) => {
                    console.log("Payment success", response);
                },
                prefill: {
                    name: "Tarun",
                    email: "tarun@example.com",
                },
                theme: {
                    color: "#2180d3", // Changed to #2180d3
                },
            };

            const razor = new (window as any).Razorpay(options);
            razor.open();
        } catch (err) {
            console.error("Payment failed", err);
        }
    };

    const renderFeature = (
        text: string,
        value: boolean | string | number,
        Icon: React.ElementType
    ) => {
        const isMoneyBackPolicy = text.toLowerCase().includes("money back");

        return (
            <li className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="flex items-center gap-2 font-medium text-gray-700">
                    <Icon className="w-5 h-5 text-gray-500" />
                    {text}
                </span>
                {typeof value === "boolean" ? (
                    value ? (
                        <CheckCircleIcon className="w-6 h-6 text-[#2180d3]" />
                    ) : (
                        <MinusCircleIcon className="w-6 h-6 text-gray-300" />
                    )
                ) : isMoneyBackPolicy ? (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        {value}
                    </span>
                ) : (
                    <span className="font-semibold text-gray-800">{value}</span>
                )}
            </li>
        );
    };

    const PlanCard = ({ plan }: { plan: Plan }) => (
        <div
            className={`relative flex flex-col justify-between bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 border-t-8 ${plan.color.replace(/from-\w+-\d+ to-\w+-\d+/, 'from-[#2180d3] to-[#1a6fb0]')} overflow-hidden`} // Adjusted color classes
        >
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-center text-gray-900 mb-1">
                    {plan.title.toUpperCase()}
                </h3>
                <p className="text-center text-gray-500 text-sm mb-2">
                    The perfect plan for your needs.
                </p>
                <div className="text-center mb-4">
                    <p className="text-3xl font-extrabold text-gray-900">{plan.price}</p>
                    <p className="text-sm text-gray-400 line-through">
                        (Original: {plan.originalPrice})
                    </p>
                </div>

                <ul className="text-base">
                    {renderFeature(
                        plan.title === "Quarterly Plan"
                            ? "3 Months Validity"
                            : plan.title === "Half Yearly Plan"
                                ? "6 Months Validity"
                                : "12 Months Validity",
                        true,
                        CalendarDaysIcon
                    )}
                    {renderFeature(
                        `${plan.premiumBadging} Premium Listing${plan.premiumBadging > 1 ? "s" : ""
                        }`,
                        true,
                        StarIcon
                    )}
                    {renderFeature(
                        `${plan.listings} Property Listing${plan.listings > 1 ? "s" : ""
                        }`,
                        true,
                        HomeModernIcon
                    )}
                    {renderFeature(
                        `Property Shows`,
                        `${plan.shows} Event${plan.shows > 1 ? "s" : ""}`,
                        CalendarDaysIcon
                    )}

                    {showMore[plan.title] && (
                        <>
                            {renderFeature("EMI Options", plan.emi, BanknotesIcon)}
                            {renderFeature("Sale Assurance", plan.saleAssurance, ShieldCheckIcon)}
                            {renderFeature("Social Media Promotions", plan.socialMedia, ShareIcon)}
                            {renderFeature("100% Money Back Policy", plan.moneyBack, ArrowUturnLeftIcon)}
                            {renderFeature("Tele Calling Service", plan.teleCalling, PhoneIcon)}
                        </>
                    )}
                </ul>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => toggleShowMore(plan.title)}
                        className="inline-flex items-center justify-center text-[#2180d3] hover:text-[#1a6fb0] text-sm font-semibold mb-3 px-5 py-1.5 rounded-full transition duration-300 border border-[#2180d3]"
                    >
                        {showMore[plan.title] ? "View Less Features" : "View More Features"}
                    </button>

                    <button
                        onClick={() => handleBuyNow(plan)}
                        className="w-full py-3 rounded-xl text-base font-bold text-white bg-gradient-to-r from-[#2180d3] to-[#1a6fb0] hover:opacity-90 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
                    >
                        BUY NOW
                    </button>

                    {plan.note && <p className="mt-2 text-xs text-gray-500">{plan.note}</p>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Unlock Your Property's Full Potential</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                    Choose a plan designed to elevate your listings and connect you with the right buyers.
                </p>
            </div>

            {/* Desktop */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch">
                {plans.map((plan) => (
                    <PlanCard key={plan.title} plan={plan} />
                ))}
            </div>

            {/* Mobile Swiper */}
            <div className="md:hidden px-4 relative">
                <Swiper
                    spaceBetween={15}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }}
                    autoplay={{ delay: 2000, disableOnInteraction: false }}
                    modules={[Pagination, Navigation, Autoplay]}
                    className="w-full"
                >
                    {plans.map((plan) => (
                        <SwiperSlide key={plan.title}>
                            <PlanCard plan={plan} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="swiper-button-prev absolute top-1/2 left-0 z-10 -translate-y-1/2 text-[#2180d3]">
                    <ChevronLeftIcon className="w-8 h-8" />
                </div>
                <div className="swiper-button-next absolute top-1/2 right-0 z-10 -translate-y-1/2 text-[#2180d3]">
                    <ChevronRightIcon className="w-8 h-8" />
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;