'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    CheckCircleIcon,
    MinusCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';
import {
    CalendarDaysIcon,
    HomeModernIcon,
    StarIcon as StarOutlineIcon,
    BanknotesIcon,
    ShieldCheckIcon,
    ShareIcon,
    ArrowUturnLeftIcon,
    PhoneIcon,
} from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Keeping existing Razorpay and data interfaces as they are
declare global {
    interface Window {
        Razorpay: {
            new (options: RazorpayOptions): RazorpayInstance;
            on(
                eventName: string,
                handler: (response: PaymentFailedResponse) => void
            ): void;
        };
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: PaymentSuccessResponse) => Promise<void>;
    prefill: {
        name: string;
        email: string;
    };
    theme: {
        color: string;
    };
}

interface PaymentSuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface PaymentFailedResponse {
    error: {
        code: string;
        description: string;
        source: string;
        step: string;
        reason: string;
        field: string;
    };
}

interface RazorpayInstance {
    open(): void;
    on(
        eventName: string,
        handler: (response: PaymentFailedResponse) => void
    ): void;
}

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
    price: number;
    originalPrice: number;
    note: string;
    order: number;
}

interface User {
    _id: string;
    username: string;
    email: string;
    plan: "Free" | "Quarterly Plan" | "Half Yearly Plan" | "Annual Plan";
    listings: number;
    premiumBadging: number;
}

interface UserPlanDetails {
    userId: string;
    planTitle: "Quarterly Plan" | "Half Yearly Plan" | "Annual Plan";
    startDate: string;
    expiryDate: string;
    transactionId: string;
    pricePaid: number;
    listings: number;
    premiumBadging: number;
    shows: number;
    emi: boolean;
    saleAssurance: boolean;
    socialMedia: boolean;
    moneyBack: boolean | string;
    teleCalling: boolean;
    originalPrice: number;
    note: string;
    planDetailsSnapshot: object;
    createdAt: string;
}

interface CurrentUserResponse {
    user: User;
    plan?: UserPlanDetails;
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
        price: 1,
        originalPrice: 17998,
        note: "Inclusive of GST",
        order: 1,
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
        price: 17999,
        originalPrice: 35998,
        note: "Inclusive of GST",
        order: 2,
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
        price: 29988,
        originalPrice: 59976,
        note: "Inclusive of GST",
        order: 3,
    },
];

const SubscriptionPage = () => {
    const [showMore, setShowMore] = useState<ShowMoreState>({});
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [activatedPlanTitle, setActivatedPlanTitle] = useState<string | null>(
        null
    );
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentUserPlanDetails, setCurrentUserPlanDetails] =
        useState<UserPlanDetails | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [razorpayLoading, setRazorpayLoading] = useState(true);
    const [showHelpContact, setShowHelpContact] = useState(false);

    const fetchUserData = useCallback(async () => {
        try {
            setLoadingUser(true);
            const res = await axios.get<CurrentUserResponse>("/api/user/current-plan");
            setCurrentUser(res.data.user);
            setCurrentUserPlanDetails(res.data.plan || null);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoadingUser(false);
        }
    }, []);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
            setRazorpayLoading(false);
        };
        script.onerror = () => {
            toast.error("Failed to load payment script. Please refresh.");
            setRazorpayLoading(false);
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [activatedPlanTitle, fetchUserData]);

    const toggleShowMore = (title: string) => {
        setShowMore((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const calculateUpgradePrice = (
        newPlan: Plan,
        currentPlanDetails: UserPlanDetails
    ): number => {
        const newPlanPrice = newPlan.price;
        const currentPlanPricePaid = currentPlanDetails.pricePaid;

        const currentStartDate = new Date(currentPlanDetails.startDate);
        const currentExpiryDate = new Date(currentPlanDetails.expiryDate);
        const currentDate = new Date();

        const totalDurationMs =
            currentExpiryDate.getTime() - currentStartDate.getTime();
        const totalDurationDays = totalDurationMs / (1000 * 60 * 60 * 24);

        const elapsedDurationMs = currentDate.getTime() - currentStartDate.getTime();
        const elapsedDurationDays = Math.max(
            0,
            elapsedDurationMs / (1000 * 60 * 60 * 24)
        );

        if (totalDurationDays <= 0 || elapsedDurationDays >= totalDurationDays) {
            return newPlanPrice;
        }

        const valueUsed = (elapsedDurationDays / totalDurationDays) * currentPlanPricePaid;
        const remainingValue = currentPlanPricePaid - valueUsed;
        const finalUpgradePrice = Math.max(0, newPlanPrice - remainingValue);

        return Math.round(finalUpgradePrice);
    };

    const processPayment = async (plan: Plan, action: "save" | "renew" | "upgrade") => {
        if (!currentUser) {
            console.error("Attempted to process payment without a user session.");
            return;
        }

        if (razorpayLoading || typeof window.Razorpay === "undefined") {
            toast.error("Payment system is not ready. Please wait a moment or refresh the page.");
            return;
        }

        let amountToSendINR = plan.price;
        let endpoint = "";
        let successMessage = "";
        let failureMessage = "";

        if (action === "save") {
            endpoint = "/api/razorpay/save-plan";
            successMessage = "Payment successful and plan activated!";
            failureMessage = "Plan activation failed:";
        } else if (action === "renew") {
            endpoint = "/api/razorpay/renew-plan";
            successMessage = "Plan successfully renewed!";
            failureMessage = "Plan renewal failed:";
        } else if (action === "upgrade") {
            if (!currentUserPlanDetails) {
                toast.error("Current plan details not found for upgrade. Cannot proceed.");
                return;
            }
            amountToSendINR = calculateUpgradePrice(plan, currentUserPlanDetails);
            endpoint = "/api/razorpay/upgrade-plan";
            successMessage = "Plan successfully upgraded!";
            failureMessage = "Plan upgrade failed:";
        }

        if (isNaN(amountToSendINR) || amountToSendINR < 0) {
            toast.error("Invalid amount for payment. Please contact support.");
            return;
        }

        const razorpayAmount = Math.max(100, Math.round(amountToSendINR * 100));

        try {
            const res = await axios.post("/api/razorpay/create-order", {
                amount: razorpayAmount,
                planName: plan.title,
            });

            const order = res.data;

            if (!order?.id || !order?.amount || !order?.currency) {
                toast.error("Failed to create payment order. Please try again.");
                console.error("Backend did not return a valid order object:", order);
                return;
            }

            if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
                toast.error("Payment gateway not configured correctly (missing key ID).");
                return;
            }

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "keyyards Subscription",
                description: `${plan.title} Subscription`,
                order_id: order.id,
                handler: async (response: PaymentSuccessResponse) => {
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
                        response;

                    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
                        toast.error(
                            "Payment successful, but verification failed. Please contact support."
                        );
                        return;
                    }

                    try {
                        const { data } = await axios.post(endpoint, {
                            razorpay_payment_id,
                            razorpay_order_id,
                            razorpay_signature,
                            plan,
                            ...(action === "upgrade" && {
                                currentUserPlanDetails: currentUserPlanDetails,
                            }),
                        });

                        if (data.success) {
                            toast.success(successMessage);
                            setActivatedPlanTitle(plan.title);
                            setShowSuccessAnimation(true);
                            fetchUserData();
                        } else {
                            toast.error(
                                `${failureMessage} ${data.message || "Please contact support."}`
                            );
                        }
                    } catch (error) {
                        const msg =
                            axios.isAxiosError(error) && error.response?.data?.message
                                ? error.response.data.message
                                : error instanceof Error
                                    ? error.message
                                    : "An unknown error occurred during plan activation.";
                        toast.error(`Payment received, but activation failed: ${msg}`);
                        console.error("Plan activation failed after successful payment:", error);
                    }
                },
                prefill: {
                    name: currentUser?.username || "Customer",
                    email: currentUser?.email || "customer@example.com",
                },
                theme: {
                    color: "#2180d3",
                },
            };

            const razor = new window.Razorpay(options);
            razor.on("payment.failed", function (response: PaymentFailedResponse) {
                toast.error(
                    `Payment Failed: ${response.error.description || "An error occurred."}`
                );
                console.error("Razorpay Payment Failed:", response.error);
            });
            razor.open();
        } catch (err) {
            const msg =
                axios.isAxiosError(err) && err.response?.data?.message
                    ? err.response.data.message
                    : err instanceof Error
                        ? err.message
                        : "Something went wrong.";
            toast.error(`Failed to initiate payment: ${msg}`);
            console.error("Payment initiation error:", err);
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

    const PlanCard = ({ plan, isElevated = false }: { plan: Plan; isElevated?: boolean }) => {
        const userHasActivePlan = currentUser && currentUser.plan !== "Free";
        const isCurrentPlan = currentUser?.plan === plan.title;
        const currentUserPlanOrder = plans.find(p => p.title === currentUser?.plan)?.order;
        const canUpgrade = currentUserPlanOrder !== undefined && plan.order > currentUserPlanOrder;
        const isLowerOrEqualPlanOrder = currentUserPlanOrder !== undefined && plan.order <= currentUserPlanOrder;

        const isRenewable = () => {
            if (currentUserPlanDetails && isCurrentPlan) {
                const expiryDate = new Date(currentUserPlanDetails.expiryDate);
                const today = new Date();
                const diffTime = expiryDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 3 && diffDays >= 0;
            }
            return false;
        };

        let buttonText = "BUY NOW";
        let buttonAction: "save" | "renew" | "upgrade" = "save";
        let buttonClasses = "bg-gradient-to-r from-[#2180d3] to-[#1a6fb0]";
        let displayPrice: string | number = plan.price;
        let buttonDisabled = false;

        if (loadingUser || razorpayLoading) {
            buttonText = "LOADING...";
            buttonClasses = "bg-gray-400 cursor-not-allowed";
            buttonDisabled = true;
        } else if (!currentUser) {
            buttonText = "LOGIN TO BUY";
            buttonClasses = "bg-gray-400 cursor-not-allowed";
            buttonDisabled = true;
        } else if (isCurrentPlan) {
            if (isRenewable()) {
                buttonText = "RENEW NOW";
                buttonAction = "renew";
                buttonClasses = "bg-gradient-to-r from-yellow-500 to-yellow-600";
                buttonDisabled = false;
            } else {
                buttonText = "CURRENT PLAN ACTIVE";
                buttonClasses = "bg-gray-400 cursor-not-allowed";
                buttonDisabled = true;
            }
        } else if (userHasActivePlan && canUpgrade && currentUserPlanDetails) {
            displayPrice = calculateUpgradePrice(plan, currentUserPlanDetails);
            buttonText = `UPGRADE (Pay ₹${displayPrice.toLocaleString()})`;
            buttonAction = "upgrade";
            buttonClasses = "bg-gradient-to-r from-green-500 to-green-600";
            buttonDisabled = false;
        } else if (userHasActivePlan && isLowerOrEqualPlanOrder) {
            buttonText = "YOU HAVE A HIGHER PLAN";
            buttonClasses = "bg-gray-400 cursor-not-allowed";
            buttonDisabled = true;
        }

        const handleButtonClick = () => {
            if (buttonDisabled) return;
            processPayment(plan, buttonAction);
        };

        const formattedExpiryDate =
            isCurrentPlan && currentUserPlanDetails?.expiryDate
                ? new Date(currentUserPlanDetails.expiryDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })
                : null;

        return (
            <div
                className={`relative flex flex-col justify-between bg-white rounded-3xl shadow-2xl transition-all duration-500 transform
                    ${isElevated
                        ? "md:scale-105 md:shadow-3xl md:z-10 md:ring-4 md:ring-offset-4 md:ring-[#2180d3]"
                        : "hover:shadow-3xl hover:-translate-y-1"
                    }
                    ${activatedPlanTitle === plan.title ? "ring-4 ring-offset-4 ring-[#2180d3] scale-105" : ""}
                    ${isCurrentPlan && !activatedPlanTitle && !isRenewable() ? "ring-4 ring-offset-4 ring-yellow-500 scale-105" : ""}
                    `}
            >
                {isElevated && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md z-20 whitespace-nowrap uppercase">
                        Most Popular
                    </div>
                )}
                <div
                    className={`p-6 bg-gradient-to-r ${plan.color} text-white text-center rounded-t-3xl ${isElevated ? "pt-8" : ""
                        }`}
                >
                    <h3 className="text-2xl font-bold">{plan.title.toUpperCase()}</h3>
                    <p className="mt-1 text-sm opacity-90">
                        The perfect plan for your needs.
                    </p>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    <div className="text-center mb-4">
                        {buttonAction === "upgrade" ? (
                            <>
                                <p className="text-3xl font-extrabold text-gray-900">
                                    ₹{displayPrice.toLocaleString()}/-
                                </p>
                                <p className="text-sm text-gray-400 line-through">
                                    (New Plan Original: ₹
                                    {plan.originalPrice.toLocaleString()})
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    (Adjusted price considering your current plan&apos;s remaining
                                    value)
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-3xl font-extrabold text-gray-900">
                                    ₹{plan.price.toLocaleString()}/-
                                </p>
                                <p className="text-sm text-gray-400 line-through">
                                    (Original: ₹{plan.originalPrice.toLocaleString()})
                                </p>
                            </>
                        )}
                        {formattedExpiryDate && isCurrentPlan && (
                            <p className="mt-2 text-sm text-gray-600 font-medium">
                                Expires: <span className="text-blue-700">{formattedExpiryDate}</span>
                            </p>
                        )}
                    </div>

                    <ul className="text-base flex-grow">
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
                            StarOutlineIcon
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
                            onClick={handleButtonClick}
                            disabled={buttonDisabled}
                            className={`w-full py-3 rounded-xl text-base font-bold text-white hover:opacity-90 transition duration-300 ease-in-out shadow-lg hover:shadow-xl ${buttonClasses}`}
                        >
                            {buttonText}
                        </button>

                        {plan.note && <p className="mt-2 text-xs text-gray-500">{plan.note}</p>}
                    </div>
                </div>
            </div>
        );
    };

    // Reorder plans for display: Quarterly, Annual, Half Yearly
    const displayedPlans = [
        plans.find((p) => p.title === "Quarterly Plan"),
        plans.find((p) => p.title === "Annual Plan"),
        plans.find((p) => p.title === "Half Yearly Plan"),
    ].filter(Boolean) as Plan[]; // Filter out any undefined in case a plan is not found

    return (
        <div
            className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden flex flex-col"
            style={{
                backgroundImage: `url('/freedom.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="flex-grow">
                <div className="max-w-7xl mx-auto text-center mb-8">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                        
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
                            Freedom Day Sales
                        </span>
                    </h2>
                    <div className="mt-4 flex items-center justify-center space-x-2">
                        <StarOutlineIcon className="w-6 h-6 text-yellow-500 animate-pulse" />
                        <span className="text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-1.5 rounded-lg shadow-xl tracking-wide transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                            50% OFF!
                        </span>
                        <StarOutlineIcon className="w-6 h-6 text-yellow-500 animate-pulse" />
                    </div>
                    <p className="mt-4 text-lg text-gray-800 max-w-3xl mx-auto">
                        Choose a plan designed to elevate your listings and connect you with the
                        right buyers. Don&apos;t miss out on these limited-time offers!
                    </p>
                </div>

                <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto items-center">
                    {displayedPlans.map((plan) => (
                        <PlanCard key={plan.title} plan={plan} isElevated={plan.title === "Annual Plan"} />
                    ))}
                </div>

                {/* Need Help Button */}
                <div className="absolute top-165 left-4 z-20 sm:left-6 lg:left-2">
                    <button
                        onClick={() => setShowHelpContact(!showHelpContact)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#2180d3] text-white rounded-full shadow-lg hover:bg-[#1a6fb0] transition duration-300 ease-in-out text-sm sm:px-4 sm:py-2 sm:text-base"
                    >
                        <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        Help?
                    </button>
                    {showHelpContact && (
                        <div className="mt-2 p-3 bg-white rounded-lg shadow-md text-gray-800 text-sm font-semibold animate-fade-in-up w-auto max-w-[200px] sm:max-w-none">
                            Call us: <a href="tel:+914040316406" className="text-[#2180d3] hover:underline whitespace-nowrap">+91 40403 16406</a>
                        </div>
                    )}
                </div>

                

                <div className="md:hidden px-4 relative">
                    <Swiper
                        spaceBetween={15}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        navigation={{
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        }}
                        autoplay={{ delay: 3000, disableOnInteraction: true }}
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

                {showSuccessAnimation && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 animate-fade-in">
                        <div className="bg-white p-6 rounded-lg shadow-2xl text-center transform scale-0 animate-pop-in relative mx-4 max-w-sm w-full">
                            <button
                                onClick={() => setShowSuccessAnimation(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                aria-label="Close"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>

                            <CheckCircleIcon className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-3 sm:mb-4 animate-bounce-once" />
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                                Congratulations!
                            </h3>
                            <p className="text-base sm:text-lg text-gray-700">
                                Your{" "}
                                <span className="font-semibold text-[#2180d3]">
                                    {activatedPlanTitle}
                                </span>{" "}
                                is now active!
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                                Get ready to unlock your property&apos;s full potential.
                            </p>
                        </div>
                        <div className="confetti-container">
                            {Array.from({ length: 50 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="confetti"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 2}s`,
                                        backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                                        animationDuration: `${2 + Math.random() * 3}s`,
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* "T&C Apply" text moved to the bottom */}
            <div className="text-center w-full mt-8 pb-4">
                <p className="text-gray-600 text-sm">*T&C apply</p>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes pop-in {
                    0% {
                        transform: scale(0.5);
                        opacity: 0;
                    }
                    80% {
                        transform: scale(1.05);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                @keyframes bounce-once {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }

                .animate-pop-in {
                    animation: pop-in 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
                }

                .animate-bounce-once {
                    animation: bounce-once 0.8s ease-in-out;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }

                .confetti-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                }

                .confetti {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    opacity: 0;
                    transform: translateY(0) rotate(0deg);
                    animation: fall 5s forwards;
                }

                @keyframes fall {
                    0% {
                        transform: translateY(-100px) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default SubscriptionPage;