import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function AdminReports() {
    const { reports = { data: [], links: [] }, filters = {} } = usePage().props;
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState("");
    const [modalMode, setModalMode] = useState("view"); // 'view' or 'update'
    const [selectedImage, setSelectedImage] = useState(null);
    // Filter states
    const [search, setSearch] = useState(filters.search || "");
    const [ticketId, setTicketId] = useState(filters.ticket_id || "");
    const [category, setCategory] = useState(filters.category || "");
    const [street, setStreet] = useState(filters.street || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");
    const [perPage, setPerPage] = useState(filters.perPage || 10);

    // Debounce global search
    useEffect(() => {
        const handle = setTimeout(() => {
            applyFilters(1);
        }, 400);
        return () => clearTimeout(handle);
    }, [search]);

    const applyFilters = (page = reports.current_page || 1) => {
        router.get(
            route("admin.reports"),
            {
                page,
                perPage,
                search,
                ticket_id: ticketId,
                category,
                street,
                status: statusFilter,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearFilters = () => {
        setSearch("");
        setTicketId("");
        setCategory("");
        setStreet("");
        setStatusFilter("");
        applyFilters(1);
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Admin Reports
                </h2>
            }
        >
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        {/* Search and Controls */}
                        <div className="mb-4 space-y-3">
                            <div className="flex flex-wrap gap-3 items-center justify-between">
                                <div className="flex gap-2 items-center flex-wrap">
                                    <input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Global search..."
                                        className="border rounded px-3 py-2 text-sm"
                                    />
                                    <select
                                        value={perPage}
                                        onChange={(e) => {
                                            setPerPage(e.target.value);
                                            applyFilters(1);
                                        }}
                                        className="border rounded px-2 py-2 text-sm"
                                    >
                                        {[10, 25, 50, 100].map((n) => (
                                            <option key={n} value={n}>
                                                {n} / page
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>

                            {/* Column Filters */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <input
                                    value={ticketId}
                                    onChange={(e) =>
                                        setTicketId(e.target.value)
                                    }
                                    onBlur={() => applyFilters()}
                                    placeholder="Filter by Ticket ID"
                                    className="border rounded px-3 py-2 text-sm"
                                />
                                <input
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    onBlur={() => applyFilters()}
                                    placeholder="Filter by Category"
                                    className="border rounded px-3 py-2 text-sm"
                                />
                                <input
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    onBlur={() => applyFilters()}
                                    placeholder="Filter by Street"
                                    className="border rounded px-3 py-2 text-sm"
                                />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        applyFilters();
                                    }}
                                    className="border rounded px-3 py-2 text-sm"
                                >
                                    <option value="">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">
                                        In Progress
                                    </option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse rounded-xl overflow-hidden">
                                <thead>
                                    <tr className="bg-black text-white">
                                        <th className="px-4 py-3 text-left">
                                            ID
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Ticket ID
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Category
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Street
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Date Submitted
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-4 py-6 text-center text-gray-500"
                                            >
                                                No reports yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        reports.data.map((r) => (
                                            <tr key={r.id} className="border-b">
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
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                openModal(
                                                                    r,
                                                                    "update"
                                                                )
                                                            }
                                                            className="text-green-600 hover:underline"
                                                        >
                                                            Update
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
                                                    const pageNum = pageMatch
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
                                                {selected.description || "—"}
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
                                        onClick={() => setSelectedImage(null)}
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
    );
}
