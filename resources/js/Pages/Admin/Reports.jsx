import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import FlashMessages from "@/Components/FlashMessages";
import ConfirmDialog from "@/Components/ConfirmDialog";

export default function AdminReports() {
    const { reports = { data: [], links: [] }, filters = {} } = usePage().props;
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState("");
    const [modalMode, setModalMode] = useState("view"); // 'view' or 'update'
    const [selectedImage, setSelectedImage] = useState(null);
    const [reportToArchive, setReportToArchive] = useState(null);
    // Filter states
    const [search, setSearch] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");
    const [categoryFilter, setCategoryFilter] = useState(
        filters.category || ""
    );
    const [perPage, setPerPage] = useState(filters.perPage || 10);
    const [sort, setSort] = useState(filters.sort || "submitted_at");
    const [direction, setDirection] = useState(filters.direction || "desc");
    const [fromDate, setFromDate] = useState(filters.from || "");
    const [toDate, setToDate] = useState(filters.to || "");

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

    // Debounce global search
    useEffect(() => {
        const handle = setTimeout(() => {
            applyFilters(1);
        }, 400);
        return () => clearTimeout(handle);
    }, [search]);

    const applyFilters = (
        page = reports.current_page || 1,
        customStatus = null,
        customSort = sort,
        customDirection = direction,
        customCategory = null
    ) => {
        router.get(
            route("admin.reports"),
            {
                page,
                perPage,
                search,
                status: customStatus !== null ? customStatus : statusFilter,
                category:
                    customCategory !== null ? customCategory : categoryFilter,
                sort: customSort,
                direction: customDirection,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("");
        setCategoryFilter("");
        router.get(
            route("admin.reports"),
            { page: 1, perPage },
            { preserveState: true, preserveScroll: true }
        );
    };

    const openModal = (report, mode = "view") => {
        setSelected(report);
        setStatus(report.status);
        setModalMode(mode);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelected(null);
    };

    const updateStatus = (e) => {
        e.preventDefault();
        if (!selected) return;
        router.patch(
            route("admin.reports.update", selected.id),
            { status },
            {
                onSuccess: () => {
                    closeModal();
                },
            }
        );
    };

    const handleSort = (col) => {
        let newDirection = direction;
        let newSort = sort;

        if (sort === col) {
            newDirection = direction === "asc" ? "desc" : "asc";
        } else {
            newSort = col;
            newDirection = "asc";
        }

        setSort(newSort);
        setDirection(newDirection);
        applyFilters(1, null, newSort, newDirection);
    };

    return (
        <>
            <FlashMessages />
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-xl text-gray-800">
                            Admin Reports
                        </h2>
                        <button
                            onClick={() =>
                                router.visit(
                                    route("admin.archives", { tab: "reports" })
                                )
                            }
                            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition text-sm font-medium"
                        >
                            Archive List
                        </button>
                    </div>
                }
            >
                <div className="py-6">
                    <div className="mx-auto max-w-[90rem] px-6">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            {/* Search and Controls */}
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-3 items-center">
                                    <input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search..."
                                        className="border rounded px-3 py-2 text-sm flex-1 min-w-[100px]"
                                    />
                                    <select
                                        value={perPage}
                                        onChange={(e) => {
                                            setPerPage(e.target.value);
                                            applyFilters(1);
                                        }}
                                        className="border rounded px-6 py-2 text-sm"
                                    >
                                        {[10, 25, 50, 100].map((n) => (
                                            <option key={n} value={n}>
                                                {n} / page
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => {
                                            const newStatus = e.target.value;
                                            setStatusFilter(newStatus);
                                            applyFilters(1, newStatus);
                                        }}
                                        className="border rounded px-7 py-2 text-sm"
                                    >
                                        <option value="">All Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">
                                            In Progress
                                        </option>
                                        <option value="Resolved">
                                            Resolved
                                        </option>
                                    </select>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => {
                                            const newCategory = e.target.value;
                                            setCategoryFilter(newCategory);
                                            applyFilters(
                                                1,
                                                null,
                                                sort,
                                                direction,
                                                newCategory
                                            );
                                        }}
                                        className="border rounded px-7 py-2 text-sm"
                                    >
                                        <option value="">All Categories</option>
                                        {CATEGORY_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) =>
                                            setFromDate(e.target.value)
                                        }
                                        className="border rounded px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) =>
                                            setToDate(e.target.value)
                                        }
                                        className="border rounded px-3 py-2 text-sm"
                                    />
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                    >
                                        Reset Filters
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const url = route(
                                                "admin.reports.export.pdf",
                                                {
                                                    from:
                                                        fromDate ||
                                                        undefined,
                                                    to:
                                                        toDate ||
                                                        undefined,
                                                }
                                            );
                                            window.open(url, "_blank");
                                        }}
                                        className="text-sm px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
                                    >
                                        Export PDF
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse rounded-xl overflow-hidden w-full">
                                    <thead>
                                        <tr className="bg-black text-white">
                                            <th
                                                className="px-4 py-3 text-left cursor-pointer whitespace-nowrap"
                                                onClick={() =>
                                                    handleSort("ticket_id")
                                                }
                                            >
                                                Ticket ID{" "}
                                                {sort === "ticket_id"
                                                    ? direction === "asc"
                                                        ? "▲"
                                                        : "▼"
                                                    : ""}
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left cursor-pointer whitespace-nowrap"
                                                onClick={() =>
                                                    handleSort("user_id")
                                                }
                                            >
                                                Posted By{" "}
                                                {sort === "user_id"
                                                    ? direction === "asc"
                                                        ? "▲"
                                                        : "▼"
                                                    : ""}
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left cursor-pointer whitespace-nowrap"
                                                onClick={() =>
                                                    handleSort("category")
                                                }
                                            >
                                                Category{" "}
                                                {sort === "category"
                                                    ? direction === "asc"
                                                        ? "▲"
                                                        : "▼"
                                                    : ""}
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left cursor-pointer"
                                                onClick={() =>
                                                    handleSort("subject")
                                                }
                                            >
                                                Subject{" "}
                                                {sort === "subject"
                                                    ? direction === "asc"
                                                        ? "▲"
                                                        : "▼"
                                                    : ""}
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left cursor-pointer whitespace-nowrap"
                                                onClick={() =>
                                                    handleSort("street")
                                                }
                                            >
                                                Street{" "}
                                                {sort === "street"
                                                    ? direction === "asc"
                                                        ? "▲"
                                                        : "▼"
                                                    : ""}
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left cursor-pointer whitespace-nowrap"
                                                onClick={() =>
                                                    handleSort("status")
                                                }
                                            >
                                                Status{" "}
                                                {sort === "status"
                                                    ? direction === "asc"
                                                        ? "▲"
                                                        : "▼"
                                                    : ""}
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left cursor-pointer whitespace-nowrap"
                                                onClick={() =>
                                                    handleSort("votes")
                                                }
                                            >
                                                Votes{" "}
                                                {sort === "votes"
                                                    ? direction === "asc"
                                                        ? "▲"
                                                        : "▼"
                                                    : ""}
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left cursor-pointer whitespace-nowrap"
                                                onClick={() =>
                                                    handleSort("submitted_at")
                                                }
                                            >
                                                Date Submitted{" "}
                                                {sort === "submitted_at"
                                                    ? direction === "asc"
                                                        ? "▲"
                                                        : "▼"
                                                    : ""}
                                            </th>
                                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="9"
                                                    className="px-4 py-6 text-center text-gray-500"
                                                >
                                                    No reports yet.
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
                                                                        r.user
                                                                            .name
                                                                    }
                                                                </div>
                                                                <div className="text-gray-500 text-xs truncate">
                                                                    {
                                                                        r.user
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
                                                            {r.subject || "-"}
                                                        </div>
                                                        {r.subject && (
                                                            <div className="hidden group-hover:block absolute left-0 top-0 bg-white border border-gray-300 shadow-lg p-2 z-10 w-max max-w-sm">
                                                                {r.subject}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 max-w-[200px] group relative">
                                                        <div className="truncate">
                                                            {r.street || "-"}
                                                        </div>
                                                        {r.street && (
                                                            <div className="hidden group-hover:block absolute left-0 top-0 bg-white border border-gray-300 shadow-lg p-2 z-10 w-max max-w-sm">
                                                                {r.street}
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
                                                        {r.submitted_at
                                                            ? new Date(
                                                                  r.submitted_at
                                                              ).toLocaleString()
                                                            : "-"}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    openModal(
                                                                        r,
                                                                        "view"
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
                                                                    openModal(
                                                                        r,
                                                                        "update"
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
                                                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    setReportToArchive(
                                                                        r
                                                                    )
                                                                }
                                                                className="text-red-600 hover:underline"
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
                                                                        d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
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
                                                        applyFilters(pageNum);
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

                            {showModal && selected && (
                                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden">
                                        <div className="flex justify-between items-center px-6 py-4 bg-black text-white">
                                            <h3 className="text-lg font-semibold">
                                                Report #{selected.ticket_id}
                                            </h3>
                                            <button
                                                onClick={closeModal}
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
                                                    {selected.category}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Street / Location:
                                                </p>
                                                <p className="font-medium">
                                                    {selected.street || "—"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Subject:
                                                </p>
                                                <p className="font-medium">
                                                    {selected.subject || "—"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Description:
                                                </p>
                                                <p className="font-medium whitespace-pre-wrap">
                                                    {selected.description ||
                                                        "—"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Submitted At:
                                                </p>
                                                <p className="font-medium">
                                                    {selected.submitted_at
                                                        ? new Date(
                                                              selected.submitted_at
                                                          ).toLocaleString()
                                                        : "—"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Images:
                                                </p>
                                                {selected.images &&
                                                selected.images.length > 0 ? (
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {selected.images.map(
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
                                            {modalMode === "update" ? (
                                                <form
                                                    onSubmit={updateStatus}
                                                    className="pt-2 border-t"
                                                >
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Status
                                                    </label>
                                                    <select
                                                        value={status}
                                                        onChange={(e) =>
                                                            setStatus(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border rounded-md px-3 py-2 w-full"
                                                    >
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
                                                    <div className="flex justify-end gap-3 mt-4">
                                                        <button
                                                            type="button"
                                                            onClick={closeModal}
                                                            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="px-4 py-2 rounded-md bg-black text-white hover:bg-yellow-500 hover:text-black transition"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="pt-2 border-t">
                                                    <p className="text-sm text-gray-600">
                                                        Status:
                                                    </p>
                                                    <span
                                                        className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full
                                                    ${
                                                        status === "Pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : ""
                                                    }
                                                    ${
                                                        status === "In Progress"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : ""
                                                    }
                                                    ${
                                                        status === "Resolved"
                                                            ? "bg-green-100 text-green-700"
                                                            : ""
                                                    }`}
                                                    >
                                                        {status}
                                                    </span>
                                                    <div className="flex justify-end mt-4">
                                                        <button
                                                            type="button"
                                                            onClick={closeModal}
                                                            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
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
                open={!!reportToArchive}
                onConfirm={() => {
                    router.post(
                        route("admin.reports.archive", reportToArchive.id)
                    );
                    setReportToArchive(null);
                }}
                onCancel={() => setReportToArchive(null)}
                title="Archive Report"
                message={`Are you sure you want to archive report ${reportToArchive?.ticket_id}? This action can be undone from the Archive List.`}
                confirmText="Archive"
                cancelText="Cancel"
                variant="warning"
            />
        </>
    );
}
