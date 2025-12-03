import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function ArchivedUsers() {
    const { users = { data: [], links: [] }, filters = {} } = usePage().props;

    // Filter / sort state
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(filters.perPage || 25);
    const [sort, setSort] = useState(filters.sort || "archived_at");
    const [direction, setDirection] = useState(filters.direction || "desc");

    useEffect(() => {
        const handle = setTimeout(() => applyFilters(1), 350);
        return () => clearTimeout(handle);
    }, [search]);

    const applyFilters = (page = 1) => {
        router.get(
            route("admin.users.archived"),
            { page, perPage, search, sort, direction },
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearFilters = () => {
        setSearch("");
        setPerPage(25);
        setSort("archived_at");
        setDirection("desc");
        applyFilters(1);
    };

    const handleSort = (col) => {
        if (sort === col) {
            setDirection(direction === "asc" ? "desc" : "asc");
        } else {
            setSort(col);
            setDirection("asc");
        }
        setTimeout(() => applyFilters(1), 0);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Archived Users
                </h2>
            }
        >
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="mb-4 space-y-3">
                            <div className="flex flex-wrap gap-3 items-center justify-between">
                                <div className="flex gap-2 items-center flex-wrap">
                                    <input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search name or email..."
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
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse rounded-xl overflow-hidden">
                                <thead>
                                    <tr className="bg-black text-white">
                                        <th
                                            className="px-4 py-3 text-left cursor-pointer"
                                            onClick={() => handleSort("name")}
                                        >
                                            Name{" "}
                                            {sort === "name"
                                                ? direction === "asc"
                                                    ? "▲"
                                                    : "▼"
                                                : ""}
                                        </th>
                                        <th
                                            className="px-4 py-3 text-left cursor-pointer"
                                            onClick={() => handleSort("email")}
                                        >
                                            Email{" "}
                                            {sort === "email"
                                                ? direction === "asc"
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
                                                handleSort("archived_at")
                                            }
                                        >
                                            Archived At{" "}
                                            {sort === "archived_at"
                                                ? direction === "asc"
                                                    ? "▲"
                                                    : "▼"
                                                : ""}
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Archived By
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-4 py-6 text-center text-gray-500"
                                            >
                                                No archived users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((u) => (
                                            <tr key={u.id} className="border-b">
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
                                                    {u.archived_by_user?.name ||
                                                        "-"}
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
