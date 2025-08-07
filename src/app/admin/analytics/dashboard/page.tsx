'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { motion } from 'framer-motion';
import { FaUsers, FaDollarSign, FaClipboardList, FaCheckCircle, FaSitemap, FaStar, FaCogs, FaChartBar, FaChartPie, FaChartLine, FaImages } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface DashboardData {
    totalUsers: number;
    activeUsers: number;
    totalListings: number;
    approvedListings: number;
    pendingListings: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    totalRevenue: number;
    premiumListings: number;
    listingsWithImages: number;
    subscriptionsByPlan: { _id: string; count: number }[];
    propertiesByType: { _id: string; count: number }[];
    revenueOverTime: { date: string; value: number }[];
    listingsOverTime: { date: string; count: number }[];
    userGrowth: { date: string; count: number }[];
    subscriptionGrowth: { date: string; count: number }[];
}

const professionalPalette = {
    primary: '#1d4ed8',
    secondary: '#059669',
    accent: '#f59e0b',
    neutral: '#6b7280',
    lightGray: '#f3f4f6',
    darkGray: '#111827',
    text: '#1f2937',
};

const refinedChartColorMapping = {
    'Quarterly Plan': '#4338ca',
    'Half Yearly Plan': '#10b981',
    'Annual Plan': '#c084fc',
    'Free': '#6b7280',
    'building': '#f97316',
    'land': '#22c55e',
    'Approved': '#10b981',
    'Pending': '#f59e0b',
    'Premium': '#fbbf24',
    'Standard': '#9ca3af',
    'Active': '#1d4ed8',
    'Inactive': '#9ca3af',
    'With Images': '#1d4ed8',
    'No Images': '#ef4444',
};

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('/api/admin/analytics/dashboard');
                setData(response.data.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                toast.error('Failed to load dashboard data.');
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-500">Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-500">
                <p>No data available.</p>
            </div>
        );
    }

    const approvalRate = data.totalListings > 0
        ? Math.round((data.approvedListings / data.totalListings) * 100)
        : 0;
    
    const userEngagementRate = data.totalUsers > 0
        ? Math.round((data.activeUsers / data.totalUsers) * 100)
        : 0;

    const approvalStatusData = [
        { id: 'Approved', label: 'Approved', value: data.approvedListings, color: refinedChartColorMapping['Approved'] },
        { id: 'Pending', label: 'Pending', value: data.pendingListings, color: refinedChartColorMapping['Pending'] },
    ];
    
    const listingsWithImagesData = [
        { id: 'With Images', label: 'With Images', value: data.listingsWithImages, color: refinedChartColorMapping['With Images'] },
        { id: 'No Images', label: 'No Images', value: data.totalListings - data.listingsWithImages, color: refinedChartColorMapping['No Images'] },
    ];

    const userStatusData = [
        { id: 'Active', label: 'Active', value: data.activeUsers, color: refinedChartColorMapping['Active'] },
        { id: 'Inactive', label: 'Inactive', value: data.totalUsers - data.activeUsers, color: refinedChartColorMapping['Inactive'] },
    ];

    const subscriptionsByPlanData = data.subscriptionsByPlan.map(item => ({
        plan: item._id,
        count: item.count,
        color: refinedChartColorMapping[item._id as keyof typeof refinedChartColorMapping] || professionalPalette.neutral,
    }));

    const propertiesByTypeData = data.propertiesByType.map(item => ({
        type: item._id,
        count: item.count,
        color: refinedChartColorMapping[item._id as keyof typeof refinedChartColorMapping] || professionalPalette.neutral,
    }));
    
    const revenueOverTimeData = data.revenueOverTime.map(item => ({
        month: item.date,
        'Revenue (₹)': item.value,
        color: professionalPalette.primary,
    }));

    // --- NEW DATA TRANSFORMATION FOR BAR CHARTS ---
    const userAndSubscriptionGrowthData = data.userGrowth.map(userItem => {
        const subscriptionItem = data.subscriptionGrowth.find(subItem => subItem.date === userItem.date);
        return {
            month: userItem.date,
            'Users': userItem.count,
            'Subscriptions': subscriptionItem ? subscriptionItem.count : 0,
        };
    });

    const listingsOverTimeData = data.listingsOverTime.map(item => ({
      month: item.date,
      count: item.count
    }));

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-8"
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard 📊</h1>
                    <p className="text-gray-500 text-sm mt-1">Comprehensive view of key metrics and insights for your real estate platform.</p>
                </div>
                
                {/* KPI Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <DashboardCard icon={<FaUsers />} title="Total Users" value={data.totalUsers} color="bg-gradient-to-br from-blue-600 to-blue-800" />
                    <DashboardCard icon={<FaClipboardList />} title="Total Listings" value={data.totalListings} color="bg-gradient-to-br from-gray-600 to-gray-800" />
                    <DashboardCard icon={<FaDollarSign />} title="Total Revenue" value={`₹${data.totalRevenue.toLocaleString()}`} color="bg-gradient-to-br from-emerald-500 to-emerald-700" />
                    <DashboardCard icon={<FaCheckCircle />} title="Approval Rate" value={`${approvalRate}%`} color="bg-gradient-to-br from-purple-600 to-purple-800" />
                    <DashboardCard icon={<FaSitemap />} title="Active Users" value={`${userEngagementRate}%`} color="bg-gradient-to-br from-rose-500 to-rose-700" />
                    <DashboardCard icon={<FaStar />} title="Premium Listings" value={data.premiumListings} color="bg-gradient-to-br from-yellow-500 to-yellow-700" />
                    <DashboardCard icon={<FaCogs />} title="Listings with Images" value={`${data.listingsWithImages} / ${data.totalListings}`} color="bg-gradient-to-br from-cyan-500 to-cyan-700" />
                    <DashboardCard icon={<FaClipboardList />} title="Active Subscriptions" value={data.activeSubscriptions} color="bg-gradient-to-br from-teal-500 to-teal-700" />
                </div>
                
                {/* Charts Section - Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-xl p-6 shadow-md h-96 transition-shadow duration-300 hover:shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaChartBar className="mr-2 text-blue-500" />Monthly Revenue</h2>
                        {data.revenueOverTime && data.revenueOverTime.length > 0 ? (
                            <ResponsiveBar
                                data={revenueOverTimeData}
                                keys={['Revenue (₹)']}
                                indexBy="month"
                                margin={{ top: 30, right: 100, bottom: 50, left: 60 }}
                                padding={0.3}
                                valueScale={{ type: 'linear' }}
                                indexScale={{ type: 'band', round: true }}
                                colors={professionalPalette.primary}
                                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Month', legendPosition: 'middle', legendOffset: 32
                                }}
                                axisLeft={{
                                    tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Revenue (₹)', legendPosition: 'middle', legendOffset: -55
                                }}
                                labelSkipWidth={12}
                                labelSkipHeight={12}
                                labelTextColor={{ from: 'color', modifiers: [['brighter', 100]] }}
                                legends={[]}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-400 font-semibold">No revenue data available.</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Monthly User & Subscription Growth Chart */}
                    <div className="bg-gray-50 rounded-xl p-6 shadow-md h-96 transition-shadow duration-300 hover:shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaChartBar className="mr-2 text-indigo-500" />Monthly User & Subscription Growth</h2>
                        {data.userGrowth && data.userGrowth.length > 0 ? (
                            <ResponsiveBar
                                data={userAndSubscriptionGrowthData}
                                keys={['Users', 'Subscriptions']}
                                indexBy="month"
                                margin={{ top: 30, right: 100, bottom: 50, left: 60 }}
                                padding={0.3}
                                valueScale={{ type: 'linear' }}
                                indexScale={{ type: 'band', round: true }}
                                colors={[professionalPalette.primary, professionalPalette.secondary]}
                                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Month', legendPosition: 'middle', legendOffset: 32,
                                }}
                                axisLeft={{
                                    tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Count', legendPosition: 'middle', legendOffset: -40,
                                }}
                                labelSkipWidth={12}
                                labelSkipHeight={12}
                                labelTextColor={{ from: 'color', modifiers: [['brighter', 100]] }}
                                legends={[
                                    {
                                        dataFrom: 'keys',
                                        anchor: 'bottom-right',
                                        direction: 'column',
                                        justify: false,
                                        translateX: 100,
                                        translateY: 0,
                                        itemsSpacing: 2,
                                        itemWidth: 100,
                                        itemHeight: 20,
                                        itemDirection: 'left-to-right',
                                        itemOpacity: 0.85,
                                        symbolSize: 20,
                                        effects: [
                                            {
                                                on: 'hover',
                                                style: { itemOpacity: 1 }
                                            }
                                        ]
                                    }
                                ]}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-400 font-semibold">No user or subscription growth data available.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Charts Section - Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-xl p-6 shadow-md h-96 transition-shadow duration-300 hover:shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaChartPie className="mr-2 text-teal-500" />Listings with Images</h2>
                        <ResponsivePie
                            data={listingsWithImagesData}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            innerRadius={0.5}
                            padAngle={0.7}
                            cornerRadius={3}
                            colors={{ datum: 'data.color' }}
                            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                            arcLinkLabelsTextColor={professionalPalette.darkGray}
                            arcLinkLabelsThickness={2}
                            arcLinkLabelsColor={{ from: 'color' }}
                            arcLabelsSkipAngle={10}
                            arcLabelsTextColor="#ffffff"
                        />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 shadow-md h-96 transition-shadow duration-300 hover:shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaChartPie className="mr-2 text-red-500" />Listings Approval Status</h2>
                        <ResponsivePie
                            data={approvalStatusData}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            innerRadius={0.5}
                            padAngle={0.7}
                            cornerRadius={3}
                            colors={{ datum: 'data.color' }}
                            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                            arcLinkLabelsTextColor={professionalPalette.darkGray}
                            arcLinkLabelsThickness={2}
                            arcLinkLabelsColor={{ from: 'color' }}
                            arcLabelsSkipAngle={10}
                            arcLabelsTextColor="#ffffff"
                        />
                    </div>
                </div>

                {/* Charts Section - Row 3 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6 shadow-md h-96 transition-shadow duration-300 hover:shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaChartBar className="mr-2 text-green-500" />Properties by Type</h2>
                        <ResponsiveBar
                            data={propertiesByTypeData}
                            keys={['count']}
                            indexBy="type"
                            margin={{ top: 30, right: 100, bottom: 50, left: 60 }}
                            padding={0.3}
                            valueScale={{ type: 'linear' }}
                            indexScale={{ type: 'band', round: true }}
                            colors={(d) => d.data.color as string}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Property Type', legendPosition: 'middle', legendOffset: 32
                            }}
                            axisLeft={{
                                tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Count', legendPosition: 'middle', legendOffset: -40
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{ from: 'color', modifiers: [['brighter', 100]] }}
                            legends={[]}
                        />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 shadow-md h-96 transition-shadow duration-300 hover:shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaChartBar className="mr-2 text-yellow-500" />Subscriptions by Plan</h2>
                        {data.subscriptionsByPlan && data.subscriptionsByPlan.length > 0 ? (
                            <ResponsiveBar
                                data={subscriptionsByPlanData}
                                keys={['count']}
                                indexBy="plan"
                                margin={{ top: 30, right: 100, bottom: 50, left: 60 }}
                                padding={0.3}
                                valueScale={{ type: 'linear' }}
                                indexScale={{ type: 'band', round: true }}
                                colors={(d) => d.data.color as string}
                                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 5, tickPadding: 5, tickRotation: 0, legend: "Plan", legendPosition: 'middle', legendOffset: 32,
                                }}
                                axisLeft={{
                                    tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Count', legendPosition: 'middle', legendOffset: -40,
                                }}
                                labelSkipWidth={12}
                                labelSkipHeight={12}
                                labelTextColor={{ from: 'color', modifiers: [['brighter', 100]] }}
                                legends={[]}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-400 font-semibold">No subscription data available.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* NEW: Monthly Listings Growth Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <div className="bg-gray-50 rounded-xl p-6 shadow-md h-96 transition-shadow duration-300 hover:shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaChartBar className="mr-2 text-pink-500" />Monthly Listings Growth</h2>
                        {data.listingsOverTime && data.listingsOverTime.length > 0 ? (
                            <ResponsiveBar
                                data={listingsOverTimeData}
                                keys={['count']}
                                indexBy="month"
                                margin={{ top: 30, right: 100, bottom: 50, left: 60 }}
                                padding={0.3}
                                valueScale={{ type: 'linear' }}
                                indexScale={{ type: 'band', round: true }}
                                colors={professionalPalette.secondary}
                                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Month', legendPosition: 'middle', legendOffset: 32
                                }}
                                axisLeft={{
                                    tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Listings', legendPosition: 'middle', legendOffset: -40
                                }}
                                labelSkipWidth={12}
                                labelSkipHeight={12}
                                labelTextColor={{ from: 'color', modifiers: [['brighter', 100]] }}
                                legends={[]}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-400 font-semibold">No listings data available.</p>
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 shadow-md h-96 transition-shadow duration-300 hover:shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaChartPie className="mr-2 text-blue-500" />User Engagement Status</h2>
                        <ResponsivePie
                            data={userStatusData}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            innerRadius={0.5}
                            padAngle={0.7}
                            cornerRadius={3}
                            colors={{ datum: 'data.color' }}
                            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                            arcLinkLabelsTextColor={professionalPalette.darkGray}
                            arcLinkLabelsThickness={2}
                            arcLinkLabelsColor={{ from: 'color' }}
                            arcLabelsSkipAngle={10}
                            arcLabelsTextColor="#ffffff"
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

interface DashboardCardProps {
    icon: React.ReactNode;
    title: string;
    value: number | string;
    color: string;
}

function DashboardCard({ icon, title, value, color }: DashboardCardProps) {
    return (
        <motion.div
            className={`flex items-center justify-between p-6 rounded-2xl shadow-md text-white ${color}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
            <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-white bg-opacity-20">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-light uppercase">{title}</p>
                    <p className="text-3xl font-extrabold">{value}</p>
                </div>
            </div>
            <div className="text-2xl opacity-50">
                {icon}
            </div>
        </motion.div>
    );
}