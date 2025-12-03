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

    const applyFilters = (page = 1) => {
        router.get(
            route("admin.archives"),
            {
                page,
                tab: activeTab,
                userSearch,
                userPerPage,
                userSort,
                userDirection,
                reportSearch,
                reportCategory,
                reportPerPage,
                reportSort,
                reportDirection,
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
        setReportCategory("");
        setReportPerPage(10);
        setReportSort("archived_at");
        setReportDirection("desc");
        setTimeout(() => applyFilters(1), 0);
    };

    const handleUserSort = (col) => {
        if (userSort === col) {
            setUserDirection(userDirection === "asc" ? "desc" : "asc");
        } else {
            setUserSort(col);
            setUserDirection("asc");
        }
        setTimeout(() => applyFilters(1), 0);
    };

    const handleReportSort = (col) => {
        if (reportSort === col) {
            setReportDirection(reportDirection === "asc" ? "desc" : "asc");
        } else {
            setReportSort(col);
            setReportDirection("asc");
        }
        setTimeout(() => applyFilters(1), 0);
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
                reportCategory,
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
                                                    className="border rounded px-2 py-2 text-sm"
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
                                                                    Restore
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
                                    <div className="mb-4 space-y-3">
                                        <div className="flex flex-wrap gap-3 items-center justify-between">
                                            <div className="flex gap-2 items-center flex-wrap">
                                                <input
                                                    value={reportSearch}
                                                    onChange={(e) =>
                                                        setReportSearch(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Global search..."
                                                    className="border rounded px-3 py-2 text-sm"
                                                />
                                                <input
                                                    value={reportCategory}
                                                    onChange={(e) =>
                                                        setReportCategory(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={() =>
                                                        applyFilters()
                                                    }
                                                    placeholder="Filter by Category"
                                                    className="border rounded px-3 py-2 text-sm"
                                                />
                                                <select
                                                    value={reportPerPage}
                                                    onChange={(e) => {
                                                        setReportPerPage(
                                                            e.target.value
                                                        );
                                                        applyFilters(1);
                                                    }}
                                                    className="border rounded px-2 py-2 text-sm"
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
                                                    onClick={clearReportFilters}
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
                                                <th className="px-4 py-3 text-left whitespace-nowrap">
                                                    ID
                                                </th>

                                                <th
                                                    className="px-4 py-3 text-left whitespace-nowrap cursor-pointer"
                                                    onClick={() =>
                                                        handleReportSort(
                                                            "ticket_id"
                                                        )
                                                    }
                                                >
                                                    Ticket ID{" "}
                                                    {reportSort === "ticket_id"
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
                                                    {reportSort === "category"
                                                        ? reportDirection ===
                                                          "asc"
                                                            ? "▲"
                                                            : "▼"
                                                        : ""}
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
                                                        colSpan="8"
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
                                                        className="border-b"
                                                    >
                                                        <td className="px-4 py-2">
                                                            {r.id}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {r.ticket_id}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {r.category}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {r.street || "-"}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {r.status}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {r.archived_at
                                                                ? new Date(
                                                                      r.archived_at
                                                                  ).toLocaleString()
                                                                : "-"}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {r.archived_by_user
                                                                ?.name || "-"}
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
                                                                        stroke-width="1.5"
                                                                        stroke="currentColor"
                                                                        class="size-6"
                                                                    >
                                                                        <path
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (
                                                                            confirm(
                                                                                `Restore report ${r.ticket_id}?`
                                                                            )
                                                                        ) {
                                                                            router.post(
                                                                                route(
                                                                                    "admin.reports.restore",
                                                                                    r.id
                                                                                )
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="text-green-600 hover:underline"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke-width="1.5"
                                                                        stroke="currentColor"
                                                                        class="size-6"
                                                                    >
                                                                        <path
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
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
