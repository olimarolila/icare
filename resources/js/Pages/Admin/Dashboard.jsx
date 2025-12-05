import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import FlashMessages from "@/Components/FlashMessages";
import { usePage, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function AdminDashboard() {
    const {
        metrics = {},
        categoryBreakdown = [],
        range = "week",
        dateRange = {},
    } = usePage().props;
    const [loadingRange, setLoadingRange] = useState(null);

    const handleRangeChange = (newRange) => {
        setLoadingRange(newRange);
        router.visit(route("admin.dashboard", { range: newRange }), {
            preserveState: true,
            onFinish: () => setLoadingRange(null),
        });
    };

    // Define colors for categories (consistent donut chart colors)
    const colors = [
        "#1e3a8a", // Blue
        "#991b1b", // Dark Red
        "#1f2937", // Dark Gray
        "#92400e", // Brown
        "#7c2d12", // Orange-Brown
        "#065f46", // Green
        "#84cc16", // Lime
        "#0891b2", // Cyan
        "#6366f1", // Indigo
        "#ec4899", // Pink
    ];

    // Create donut chart SVG
    const createDonutChart = () => {
        if (categoryBreakdown.length === 0) return null;

        const total = categoryBreakdown.reduce(
            (sum, cat) => sum + cat.count,
            0
        );
        let currentAngle = -Math.PI / 2;
        const radius = 80;
        const innerRadius = 50;
        const cx = 100;
        const cy = 100;

        const paths = categoryBreakdown.map((cat, idx) => {
            const sliceAngle = (cat.count / total) * 2 * Math.PI;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;

            // Outer arc
            const x1 = cx + radius * Math.cos(startAngle);
            const y1 = cy + radius * Math.sin(startAngle);
            const x2 = cx + radius * Math.cos(endAngle);
            const y2 = cy + radius * Math.sin(endAngle);

            // Inner arc
            const x3 = cx + innerRadius * Math.cos(endAngle);
            const y3 = cy + innerRadius * Math.sin(endAngle);
            const x4 = cx + innerRadius * Math.cos(startAngle);
            const y4 = cy + innerRadius * Math.sin(startAngle);

            const largeArc = sliceAngle > Math.PI ? 1 : 0;

            const pathD = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;

            currentAngle = endAngle;

            return (
                <path
                    key={idx}
                    d={pathD}
                    fill={colors[idx % colors.length]}
                    stroke="white"
                    strokeWidth="2"
                />
            );
        });

        return (
            <svg width="200" height="200" viewBox="0 0 200 200">
                {paths}
            </svg>
        );
    };

    return (
        <>
            <FlashMessages />
            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl text-gray-800">
                        Admin Dashboard
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                        {/* Overview Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Overview
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {dateRange.start
                                            ? `${dateRange.start} - ${dateRange.end}`
                                            : `All time data`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            handleRangeChange("week")
                                        }
                                        disabled={loadingRange !== null}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                                            range === "week"
                                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                                        } ${
                                            loadingRange === "week"
                                                ? "opacity-60"
                                                : ""
                                        }`}
                                    >
                                        {loadingRange === "week"
                                            ? "⟳ Week"
                                            : "Week"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleRangeChange("month")
                                        }
                                        disabled={loadingRange !== null}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                                            range === "month"
                                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                                        } ${
                                            loadingRange === "month"
                                                ? "opacity-60"
                                                : ""
                                        }`}
                                    >
                                        {loadingRange === "month"
                                            ? "⟳ Month"
                                            : "Month"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleRangeChange("year")
                                        }
                                        disabled={loadingRange !== null}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                                            range === "year"
                                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                                        } ${
                                            loadingRange === "year"
                                                ? "opacity-60"
                                                : ""
                                        }`}
                                    >
                                        {loadingRange === "year"
                                            ? "⟳ Year"
                                            : "Year"}
                                    </button>
                                    <button
                                        onClick={() => handleRangeChange("all")}
                                        disabled={loadingRange !== null}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                                            range === "all"
                                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                                        } ${
                                            loadingRange === "all"
                                                ? "opacity-60"
                                                : ""
                                        }`}
                                    >
                                        {loadingRange === "all"
                                            ? "⟳ All"
                                            : "All"}
                                    </button>
                                </div>
                            </div>

                            {/* Metric Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Total Tickets */}
                                <div className="bg-orange-500 text-white rounded-lg p-6 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">
                                                Total Tickets Submitted
                                            </p>
                                            <p className="text-4xl font-bold mt-2">
                                                {metrics.total ?? 0}
                                            </p>
                                        </div>
                                        <div className="text-6xl opacity-30">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-16 h-16"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 0 1-.375.65 2.249 2.249 0 0 0 0 3.898.75.75 0 0 1 .375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 17.625v-3.026a.75.75 0 0 1 .374-.65 2.249 2.249 0 0 0 0-3.898.75.75 0 0 1-.374-.65V6.375Zm15-1.125a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm-.75 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75ZM6 12a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 12Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Pending */}
                                <div className="bg-red-600 text-white rounded-lg p-6 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">
                                                Pending Reports
                                            </p>
                                            <p className="text-4xl font-bold mt-2">
                                                {metrics.pending ?? 0}
                                            </p>
                                        </div>
                                        <div className="text-6xl opacity-30">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-16 h-16"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM15.375 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* In Progress */}
                                <div className="bg-blue-600 text-white rounded-lg p-6 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">
                                                In Progress
                                            </p>
                                            <p className="text-4xl font-bold mt-2">
                                                {metrics.inProgress ?? 0}
                                            </p>
                                        </div>
                                        <div className="text-6xl opacity-30">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-16 h-16"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Resolved */}
                                <div className="bg-green-700 text-white rounded-lg p-6 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">
                                                Resolved Reports
                                            </p>
                                            <p className="text-4xl font-bold mt-2">
                                                {metrics.resolved ?? 0}
                                            </p>
                                        </div>
                                        <div className="text-6xl opacity-30">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-16 h-16"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Issues Discovered Section */}
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                Issues Discovered
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Category List */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-4">
                                        Issue Type
                                    </h4>
                                    <div className="space-y-3">
                                        {categoryBreakdown.length > 0 ? (
                                            categoryBreakdown.map(
                                                (cat, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between text-sm"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-3 h-3 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        colors[
                                                                            idx %
                                                                                colors.length
                                                                        ],
                                                                }}
                                                            />
                                                            <span className="text-gray-700">
                                                                {cat.category ||
                                                                    "Uncategorized"}
                                                            </span>
                                                        </div>
                                                        <span className="font-semibold text-gray-900">
                                                            {cat.count}
                                                        </span>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <p className="text-gray-500 text-sm">
                                                No data available
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-4">
                                        Total Count:{" "}
                                        {categoryBreakdown.reduce(
                                            (sum, cat) => sum + cat.count,
                                            0
                                        )}
                                    </p>
                                </div>

                                {/* Donut Chart */}
                                <div className="lg:col-span-2 flex items-center justify-center">
                                    {createDonutChart()}
                                </div>
                            </div>

                            <div className="mt-6">
                                {/* <button className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1">
                                    See Details &gt;
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
