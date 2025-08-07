import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Property from "@/models/propertyModel";
import Plan from "@/models/planModel";

connectDb();

export async function GET(request: NextRequest) {
    try {
        // Fetching user data
        const totalUsers = await User.countDocuments({});
        const activeUsers = await User.countDocuments({ isActive: true });

        // Fetching property data
        const totalListings = await Property.countDocuments({});
        const approvedListings = await Property.countDocuments({ isApproved: true });
        const pendingListings = await Property.countDocuments({ isApproved: false });
        const premiumListings = await Property.countDocuments({ isPremium: true });
        const listingsWithImages = await Property.countDocuments({ "images.0": { "$exists": true } });

        // Fetching subscriptions data
        const totalSubscriptions = await Plan.countDocuments({});
        const activeSubscriptions = await Plan.countDocuments({ expiryDate: { $gt: new Date() } });

        // Calculate total revenue from subscriptions
        const revenueResult = await Plan.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: { $toDouble: "$pricePaid" }
                    }
                }
            }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // Fetch monthly revenue data dynamically
        const revenueOverTime = await Plan.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    value: { $sum: "$pricePaid" }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    value: "$value"
                }
            }
        ]);

        // Fetch monthly listings data dynamically
        const listingsOverTime = await Property.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    count: "$count"
                }
            }
        ]);

        // Breakdown of subscriptions by plan type
        const subscriptionsByPlan = await Plan.aggregate([
            {
                $group: {
                    _id: "$planTitle",
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Breakdown of properties by type
        const propertiesByType = await Property.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            }
        ]);

        // --- NEW AGGREGATION QUERIES FOR TIME-SERIES DATA ---
        // Fetch monthly user growth data
        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    count: "$count"
                }
            }
        ]);

        // Fetch monthly subscription growth data
        const subscriptionGrowth = await Plan.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    count: "$count"
                }
            }
        ]);

        return NextResponse.json({
            status: "success",
            data: {
                totalUsers,
                activeUsers,
                totalListings,
                approvedListings,
                pendingListings,
                premiumListings,
                listingsWithImages,
                totalSubscriptions,
                activeSubscriptions,
                totalRevenue,
                subscriptionsByPlan,
                propertiesByType,
                revenueOverTime,
                listingsOverTime,
                userGrowth,
                subscriptionGrowth,
            },
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json({
            status: "error",
            error: "Failed to fetch dashboard data"
        }, { status: 500 });
    }
}