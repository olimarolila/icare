import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import FlashMessages from "@/Components/FlashMessages";
import ConfirmDialog from "@/Components/ConfirmDialog";

export default function Archives() {
    const {
        users = { data: [], links: [] },
        reports = { data: [], links: [] },
        filters = {},
        activeTab: initialTab = "users",
    } = usePage().props;

    const [activeTab, setActiveTab] = useState(initialTab);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [userToRestore, setUserToRestore] = useState(null);
    const [reportToRestore, setReportToRestore] = useState(null);

    // User filters
    const [userSearch, setUserSearch] = useState(filters.userSearch || "");
    const [userPerPage, setUserPerPage] = useState(filters.userPerPage || 25);
    const [userSort, setUserSort] = useState(filters.userSort || "archived_at");
    const [userDirection, setUserDirection] = useState(
        filters.userDirection || "desc"
    );

    // Report filters
    const [reportSearch, setReportSearch] = useState(
        filters.reportSearch || ""
    );
    const [reportStatus, setReportStatus] = useState(
        filters.reportStatus || ""
    );
    const [reportCategory, setReportCategory] = useState(
        filters.reportCategory || ""
    );
    const [reportPerPage, setReportPerPage] = useState(
        filters.reportPerPage || 10
    );
    const [reportSort, setReportSort] = useState(
        filters.reportSort || "archived_at"
    );
    const [reportDirection, setReportDirection] = useState(
        filters.reportDirection || "desc"
    );

    useEffect(() => {
        const handle = setTimeout(() => applyFilters(1), 350);
        return () => clearTimeout(handle);
    }, [userSearch, reportSearch]);

    const CATEGORY_OPTIONS = [
        "Building & Facilities",
        "Flood Control Works",
        "Parks & Public Spaces",
        "Road Works",
        "Streetlights & Electrical",
        "Traffic & Signage",
        "Waste Management",
        "Water Supply & Plumbing",
        "Others",
    ];

    const applyFilters = (
        page = 1,
        customReportStatus = null,
        customUserSort = userSort,
        customUserDirection = userDirection,
        customReportSort = reportSort,
        customReportDirection = reportDirection,
        customReportCategory = null
    ) => {
        router.get(
            route("admin.archives"),
            {
                page,
                tab: activeTab,
                userSearch,
                userPerPage,
                userSort: customUserSort,
                userDirection: customUserDirection,
                reportSearch,
                reportStatus:
                    customReportStatus !== null
                        ? customReportStatus
                        : reportStatus,
                reportCategory:
                    customReportCategory !== null
                        ? customReportCategory
                        : reportCategory,
                reportPerPage,
                reportSort: customReportSort,
                reportDirection: customReportDirection,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearUserFilters = () => {
        setUserSearch("");
        setUserPerPage(25);
        setUserSort("archived_at");
        setUserDirection("desc");
        setTimeout(() => applyFilters(1), 0);
    };

    const clearReportFilters = () => {
        setReportSearch("");
        setReportStatus("");
        setReportCategory("");
        setReportPerPage(10);
        setReportSort("archived_at");
        setReportDirection("desc");
        applyFilters(1, "", userSort, userDirection, "archived_at", "desc", "");
    };

    const handleUserSort = (col) => {
        let newDirection = userDirection;
        let newSort = userSort;

        if (userSort === col) {
            newDirection = userDirection === "asc" ? "desc" : "asc";
        } else {
            newSort = col;
            newDirection = "asc";
        }

        setUserSort(newSort);
        setUserDirection(newDirection);
        applyFilters(
            1,
            null,
            newSort,
            newDirection,
            reportSort,
            reportDirection
        );
    };

    const handleReportSort = (col) => {
        let newDirection = reportDirection;
        let newSort = reportSort;

        if (reportSort === col) {
            newDirection = reportDirection === "asc" ? "desc" : "asc";
        } else {
            newSort = col;
            newDirection = "asc";
        }

        setReportSort(newSort);
        setReportDirection(newDirection);
        applyFilters(1, null, userSort, userDirection, newSort, newDirection);
    };

    const switchTab = (tab) => {
        setActiveTab(tab);
        router.get(
            route("admin.archives"),
            {
                tab,
                userSearch,
                userPerPage,
                userSort,
                userDirection,
                reportSearch,
                reportStatus,
                reportPerPage,
                reportSort,
                reportDirection,
            },
            { preserveState: true, preserveScroll: false }
        );
    };

    const openReportModal = (report) => {
        setSelectedReport(report);
        setShowReportModal(true);
    };

    const closeReportModal = () => {
        setShowReportModal(false);
        setSelectedReport(null);
    };

    return (
        <>
            <FlashMessages />
            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl text-gray-800">
                        Archives
                    </h2>
                }
            >
                <div className="py-6">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            {/* Tabs */}
                            <div className="border-b border-gray-200 mb-6">
                                <nav className="-mb-px flex space-x-8">
                                    <button
                                        onClick={() => switchTab("users")}
                                        className={`${
                                            activeTab === "users"
                                                ? "border-black text-black"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition`}
                                    >
                                        Archived Users
                                    </button>
                                    <button
                                        onClick={() => switchTab("reports")}
                                        className={`${
                                            activeTab === "reports"
                                                ? "border-black text-black"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition`}
                                    >
                                        Archived Reports
                                    </button>
                                </nav>
                            </div>

                            {/* Users Tab Content */}
                            {activeTab === "users" && (
                                <div>
                                    <div className="mb-4 space-y-3">
                                        <div className="flex flex-wrap gap-3 items-center justify-between">
                                            <div className="flex gap-2 items-center flex-wrap">
                                                <input
                                                    value={userSearch}
                                                    onChange={(e) =>
                                                        setUserSearch(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Search name or email..."
                                                    className="border rounded px-3 py-2 text-sm"
                                                />
                                                <select
                                                    value={userPerPage}
                                                    onChange={(e) => {
                                                        setUserPerPage(
                                                            e.target.value
                                                        );
                                                        applyFilters(1);
                                                    }}
                                                    className="border rounded px-6 py-2 text-sm"
                                                >
                                                    {[10, 25, 50, 100].map(
                                                        (n) => (
                                                            <option
                                                                key={n}
                                                                value={n}
                                                            >
                                                                {n} / page
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                <button
                                                    onClick={clearUserFilters}
                                                    className="text-xs px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                                >
                                                    Clear Filters
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border-collapse rounded-xl overflow-hidden">
                                            <thead>
                                                <tr className="bg-black text-white">
                                                    <th
                                                        className="px-4 py-3 text-left cursor-pointer"
                                                        onClick={() =>
                                                            handleUserSort(
                                                                "name"
                                                            )
                                                        }
                                                    >
                                                        Name{" "}
                                                        {userSort === "name"
                                                            ? userDirection ===
                                                              "asc"
                                                                ? "▲"
                                                                : "▼"
                                                            : ""}
                                                    </th>
                                                    <th
                                                        className="px-4 py-3 text-left cursor-pointer"
                                                        onClick={() =>
                                                            handleUserSort(
                                                                "email"
                                                            )
                                                        }
                                                    >
                                                        Email{" "}
                                                        {userSort === "email"
                                                            ? userDirection ===
                                                              "asc"
                                                                ? "▲"
                                                                : "▼"
                                                            : ""}
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        Role
                                                    </th>
                                                    <th
                                                        className="px-4 py-3 text-left cursor-pointer"
                                                        onClick={() =>
                                                            handleUserSort(
                                                                "archived_at"
                                                            )
                                                        }
                                                    >
                                                        Archived At{" "}
                                                        {userSort ===
                                                        "archived_at"
                                                            ? userDirection ===
                                                              "asc"
                                                                ? "▲"
                                                                : "▼"
                                                            : ""}
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        Archived By
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.data.length === 0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan="6"
                                                            className="px-4 py-6 text-center text-gray-500"
                                                        >
                                                            No archived users
                                                            found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    users.data.map((u) => (
                                                        <tr
                                                            key={u.id}
                                                            className="border-b"
                                                        >
                                                            <td className="px-4 py-2">
                                                                {u.name}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                {u.email}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                {u.role || "-"}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                {u.archived_at
                                                                    ? new Date(
                                                                          u.archived_at
                                                                      ).toLocaleString()
                                                                    : "-"}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                {u
                                                                    .archived_by_user
                                                                    ?.name ||
                                                                    "-"}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <button
                                                                    onClick={() =>
                                                                        setUserToRestore(
                                                                            u
                                                                        )
                                                                    }
                                                                    className="text-green-600 hover:underline"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth="1.5"
                                                                        stroke="currentColor"
                                                                        class="size-6"
                                                                    >
                                                                        <path
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex items-center justify-end mt-4">
                                        <div className="flex gap-1 flex-wrap">
                                            {users.links &&
                                                users.links.map((l, i) => (
                                                    <button
                                                        key={i}
                                                        disabled={!l.url}
                                                        onClick={() => {
                                                            if (l.url) {
                                                                const pageMatch =
                                                                    l.url.match(
                                                                        /page=(\d+)/
                                                                    );
                                                                const pageNum =
                                                                    pageMatch
                                                                        ? pageMatch[1]
                                                                        : 1;
                                                                applyFilters(
                                                                    pageNum
                                                                );
                                                            }
                                                        }}
                                                        className={`px-3 py-1 rounded text-sm border ${
                                                            l.active
                                                                ? "bg-black text-white"
                                                                : "bg-white hover:bg-black hover:text-white"
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: l.label,
                                                        }}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Reports Tab Content */}
                            {activeTab === "reports" && (
                                <div>
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-3 items-center">
                                            <input
                                                value={reportSearch}
                                                onChange={(e) =>
                                                    setReportSearch(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Search..."
                                                className="border rounded px-3 py-2 text-sm flex-1 min-w-[200px]"
                                            />
                                            <select
                                                value={reportPerPage}
                                                onChange={(e) => {
                                                    setReportPerPage(
                                                        e.target.value
                                                    );
                                                    applyFilters(1);
                                                }}
                                                className="border rounded px-3 py-2 text-sm"
                                            >
                                                {[10, 25, 50, 100].map((n) => (
                                                    <option key={n} value={n}>
                                                        {n} / page
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                value={reportStatus}
                                                onChange={(e) => {
                                                    const newStatus =
                                                        e.target.value;
                                                    setReportStatus(newStatus);
                                                    applyFilters(1, newStatus);
                                                }}
                                                className="border rounded px-3 py-2 text-sm"
                                            >
                                                <option value="">
                                                    All Status
                                                </option>
                                                <option value="Pending">
                                                    Pending
                                                </option>
                                                <option value="In Progress">
                                                    In Progress
                                                </option>
                                                <option value="Resolved">
                                                    Resolved
                                                </option>
                                            </select>
                                            <select
                                                value={reportCategory}
                                                onChange={(e) => {
                                                    const newCategory =
                                                        e.target.value;
                                                    setReportCategory(
                                                        newCategory
                                                    );
                                                    applyFilters(
                                                        1,
                                                        reportStatus,
                                                        userSort,
                                                        userDirection,
                                                        reportSort,
                                                        reportDirection,
                                                        newCategory
                                                    );
                                                }}
                                                className="border rounded px-3 py-2 text-sm min-w-[180px]"
                                            >
                                                <option value="">
                                                    All Categories
                                                </option>
                                                {CATEGORY_OPTIONS.map(
                                                    (option) => (
                                                        <option
                                                            key={option}
                                                            value={option}
                                                        >
                                                            {option}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                            <button
                                                onClick={clearReportFilters}
                                                className="text-sm px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                            >
                                                Reset Filters
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border-collapse rounded-xl overflow-hidden">
                                            <thead>
                                                <tr className="bg-black text-white">
                                                    <th
                                                        className="px-4 py-3 text-left whitespace-nowrap cursor-pointer"
                                                        onClick={() =>
                                                            handleReportSort(
                                                                "ticket_id"
                                                            )
                                                        }
                                                    >
                                                        Ticket ID{" "}
                                                        {reportSort ===
                                                        "ticket_id"
                                                            ? reportDirection ===
                                                              "asc"
                                                                ? "▲"
                                                                : "▼"
                                                            : ""}
                                                    </th>

                                                    <th
                                                        className="px-4 py-3 text-left whitespace-nowrap cursor-pointer"
                                                        onClick={() =>
                                                            handleReportSort(
                                                                "user_id"
                                                            )
                                                        }
                                                    >
                                                        Posted By{" "}
                                                        {reportSort ===
                                                        "user_id"
                                                            ? reportDirection ===
                                                              "asc"
                                                                ? "▲"
                                                                : "▼"
                                                            : ""}
                                                    </th>

                                                    <th
                                                        className="px-4 py-3 text-left whitespace-nowrap cursor-pointer"
                                                        onClick={() =>
                                                            handleReportSort(
                                                                "category"
                                                            )
                                                        }
                                                    >
                                                        Category{" "}
                                                        {reportSort ===
                                                        "category"
                                                            ? reportDirection ===
                                                              "asc"
                                                                ? "▲"
                                                                : "▼"
                                                            : ""}
                                                    </th>

                                                    <th className="px-4 py-3 text-left whitespace-nowrap">
                                                        Subject
                                                    </th>

                                                    <th className="px-4 py-3 text-left whitespace-nowrap">
                                                        Street
                                                    </th>

                                                    <th
                                                        className="px-4 py-3 text-left whitespace-nowrap cursor-pointer"
                                                        onClick={() =>
                                                            handleReportSort(
                                                                "status"
                                                            )
                                                        }
                                                    >
                                                        Status{" "}
                                                        {reportSort === "status"
                                                            ? reportDirection ===
                                                              "asc"
                                                                ? "▲"
                                                                : "▼"
                                                            : ""}
                                                    </th>

                                                    <th
                                                        className="px-4 py-3 text-left whitespace-nowrap cursor-pointer"
                                                        onClick={() =>
                                                            handleReportSort(
                                                                "votes"
                                                            )
                                                        }
                                                    >
                                                        Votes{" "}
                                                        {reportSort === "votes"
                                                            ? reportDirection ===
                                                              "asc"
                                                                ? "▲"
                                                                : "▼"
                                                            : ""}
                                                    </th>

                                                    <th
                                                        className="px-4 py-3 text-left whitespace-nowrap cursor-pointer"
                                                        onClick={() =>
                                                            handleReportSort(
                                                                "archived_at"
                                                            )
                                                        }
                                                    >
                                                        Archived At{" "}
                                                        {reportSort ===
                                                        "archived_at"
                                                            ? reportDirection ===
                                                              "asc"
                                                                ? "▲"
                                                                : "▼"
                                                            : ""}
                                                    </th>

                                                    <th className="px-4 py-3 text-left whitespace-nowrap">
                                                        Archived By
                                                    </th>

                                                    <th className="px-4 py-3 text-left whitespace-nowrap">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {reports.data.length === 0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan="10"
                                                            className="px-4 py-6 text-center text-gray-500"
                                                        >
                                                            No archived reports
                                                            found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    reports.data.map((r) => (
                                                        <tr
                                                            key={r.id}
                                                            className="border-b text-sm text-gray-800"
                                                        >
                                                            <td className="px-4 py-2">
                                                                {r.ticket_id}
                                                            </td>
                                                            <td className="px-4 py-2 max-w-[150px] group relative">
                                                                {r.user ? (
                                                                    <div className="text-sm truncate">
                                                                        <div className="font-medium truncate">
                                                                            {
                                                                                r
                                                                                    .user
                                                                                    .name
                                                                            }
                                                                        </div>
                                                                        <div className="text-gray-500 text-xs truncate">
                                                                            {
                                                                                r
                                                                                    .user
                                                                                    .email
                                                                            }
                                                                        </div>
                                                                        <div className="hidden group-hover:block absolute left-0 top-0 bg-white border border-gray-300 shadow-lg p-2 z-10 w-max max-w-sm">
                                                                            <div className="font-medium">
                                                                                {
                                                                                    r
                                                                                        .user
                                                                                        .name
                                                                                }
                                                                            </div>
                                                                            <div className="text-gray-500 text-xs">
                                                                                {
                                                                                    r
                                                                                        .user
                                                                                        .email
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-400">
                                                                        Guest
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                {r.category}
                                                            </td>
                                                            <td className="px-4 py-2 max-w-[200px] group relative">
                                                                <div className="truncate">
                                                                    {r.subject ||
                                                                        "-"}
                                                                </div>
                                                                {r.subject && (
                                                                    <div className="hidden group-hover:block absolute left-0 top-0 bg-white border border-gray-300 shadow-lg p-2 z-10 w-max max-w-sm">
                                                                        {
                                                                            r.subject
                                                                        }
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2 max-w-[200px] group relative">
                                                                <div className="truncate">
                                                                    {r.street ||
                                                                        "-"}
                                                                </div>
                                                                {r.street && (
                                                                    <div className="hidden group-hover:block absolute left-0 top-0 bg-white border border-gray-300 shadow-lg p-2 z-10 w-max max-w-sm">
                                                                        {
                                                                            r.street
                                                                        }
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                {r.status}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                {r.votes || 0}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                {r.archived_at
                                                                    ? new Date(
                                                                          r.archived_at
                                                                      ).toLocaleString()
                                                                    : "-"}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                {r
                                                                    .archived_by_user
                                                                    ?.name ||
                                                                    "-"}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            openReportModal(
                                                                                r
                                                                            )
                                                                        }
                                                                        className="text-blue-600 hover:underline"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth="1.5"
                                                                            stroke="currentColor"
                                                                            className="size-6"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            setReportToRestore(
                                                                                r
                                                                            )
                                                                        }
                                                                        className="text-green-600 hover:underline"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth="1.5"
                                                                            stroke="currentColor"
                                                                            class="size-6"
                                                                        >
                                                                            <path
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex items-center justify-end mt-4">
                                        <div className="flex gap-1 flex-wrap">
                                            {reports.links &&
                                                reports.links.map((l, i) => (
                                                    <button
                                                        key={i}
                                                        disabled={!l.url}
                                                        onClick={() => {
                                                            if (l.url) {
                                                                const pageMatch =
                                                                    l.url.match(
                                                                        /page=(\d+)/
                                                                    );
                                                                const pageNum =
                                                                    pageMatch
                                                                        ? pageMatch[1]
                                                                        : 1;
                                                                applyFilters(
                                                                    pageNum
                                                                );
                                                            }
                                                        }}
                                                        className={`px-3 py-1 rounded text-sm border ${
                                                            l.active
                                                                ? "bg-black text-white"
                                                                : "bg-white hover:bg-black hover:text-white"
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: l.label,
                                                        }}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Report Detail Modal */}
                            {showReportModal && selectedReport && (
                                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden">
                                        <div className="flex justify-between items-center px-6 py-4 bg-black text-white">
                                            <h3 className="text-lg font-semibold">
                                                Report #
                                                {selectedReport.ticket_id}
                                            </h3>
                                            <button
                                                onClick={closeReportModal}
                                                className="text-white hover:text-yellow-400"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Category:
                                                </p>
                                                <p className="font-medium">
                                                    {selectedReport.category}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Street / Location:
                                                </p>
                                                <p className="font-medium">
                                                    {selectedReport.street ||
                                                        "—"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Subject:
                                                </p>
                                                <p className="font-medium">
                                                    {selectedReport.subject ||
                                                        "—"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Description:
                                                </p>
                                                <p className="font-medium whitespace-pre-wrap">
                                                    {selectedReport.description ||
                                                        "—"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Status:
                                                </p>
                                                <span
                                                    className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full
                                                ${
                                                    selectedReport.status ===
                                                    "Pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : ""
                                                }
                                                ${
                                                    selectedReport.status ===
                                                    "In Progress"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : ""
                                                }
                                                ${
                                                    selectedReport.status ===
                                                    "Resolved"
                                                        ? "bg-green-100 text-green-700"
                                                        : ""
                                                }`}
                                                >
                                                    {selectedReport.status}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Submitted At:
                                                </p>
                                                <p className="font-medium">
                                                    {selectedReport.submitted_at
                                                        ? new Date(
                                                              selectedReport.submitted_at
                                                          ).toLocaleString()
                                                        : "—"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Archived At:
                                                </p>
                                                <p className="font-medium">
                                                    {selectedReport.archived_at
                                                        ? new Date(
                                                              selectedReport.archived_at
                                                          ).toLocaleString()
                                                        : "—"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Archived By:
                                                </p>
                                                <p className="font-medium">
                                                    {selectedReport
                                                        .archived_by_user
                                                        ?.name || "—"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Images:
                                                </p>
                                                {selectedReport.images &&
                                                selectedReport.images.length >
                                                    0 ? (
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {selectedReport.images.map(
                                                            (img, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={
                                                                        "/storage/" +
                                                                        img
                                                                    }
                                                                    alt={
                                                                        "report-img-" +
                                                                        idx
                                                                    }
                                                                    onClick={() =>
                                                                        setSelectedImage(
                                                                            "/storage/" +
                                                                                img
                                                                        )
                                                                    }
                                                                    className="h-24 w-full object-cover rounded-md border cursor-pointer hover:opacity-75 transition"
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500">
                                                        No images
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex justify-end pt-2 border-t">
                                                <button
                                                    type="button"
                                                    onClick={closeReportModal}
                                                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Image Viewer Modal */}
                            {selectedImage && (
                                <div
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <div className="relative max-w-5xl max-h-[90vh]">
                                        <button
                                            onClick={() =>
                                                setSelectedImage(null)
                                            }
                                            className="absolute -top-10 right-0 text-white hover:text-yellow-400 text-2xl font-bold"
                                        >
                                            ✕
                                        </button>
                                        <img
                                            src={selectedImage}
                                            alt="Full size"
                                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            <ConfirmDialog
                open={!!userToRestore}
                onConfirm={() => {
                    router.post(route("admin.users.restore", userToRestore.id));
                    setUserToRestore(null);
                }}
                onCancel={() => setUserToRestore(null)}
                title="Restore User"
                message={`Are you sure you want to restore user ${userToRestore?.name}?`}
                confirmText="Restore"
                cancelText="Cancel"
                variant="success"
            />

            <ConfirmDialog
                open={!!reportToRestore}
                onConfirm={() => {
                    router.post(
                        route("admin.reports.restore", reportToRestore.id)
                    );
                    setReportToRestore(null);
                }}
                onCancel={() => setReportToRestore(null)}
                title="Restore Report"
                message={`Are you sure you want to restore report ${reportToRestore?.ticket_id}?`}
                confirmText="Restore"
                cancelText="Cancel"
                variant="success"
            />
        </>
    );
}
