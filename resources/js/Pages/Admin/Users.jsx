import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import FlashMessages from "@/Components/FlashMessages";
import ConfirmDialog from "@/Components/ConfirmDialog";

export default function AdminUsers() {
    const { users = { data: [], links: [] }, filters = {} } = usePage().props;
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [userToArchive, setUserToArchive] = useState(null);
    const [userToBan, setUserToBan] = useState(null);
    const [banReason, setBanReason] = useState("");
    const [userToBanPlatform, setUserToBanPlatform] = useState(null);
    const [platformBanReason, setPlatformBanReason] = useState("");

    const dtRef = useRef(null);
    const dtInitialized = useRef(false);

    // Filter / sort state
    const [search, setSearch] = useState(filters.search || "");
    const [roleFilter, setRoleFilter] = useState(filters.role || "");
    const [perPage, setPerPage] = useState(filters.perPage || 25);
    const [sort, setSort] = useState(filters.sort || "created_at");
    const [direction, setDirection] = useState(filters.direction || "desc");

    useEffect(() => {
        const handle = setTimeout(() => applyFilters(1), 350);
        return () => clearTimeout(handle);
    }, [search]);

    // DataTables integration (client-side over all users) - DISABLED
    useEffect(() => {
        // DataTables disabled to avoid conflicts with React rendering
        return () => {};

        let cssLink;
        const cssHref =
            "https://cdn.datatables.net/2.3.5/css/dataTables.dataTables.min.css";
        if (!document.querySelector(`link[href="${cssHref}"]`)) {
            cssLink = document.createElement("link");
            cssLink.rel = "stylesheet";
            cssLink.href = cssHref;
            document.head.appendChild(cssLink);
        }

        const jsSrc = "https://cdn.datatables.net/2.3.5/js/dataTables.min.js";
        let script = document.querySelector(`script[src="${jsSrc}"]`);

        const initFromData = (data) => {
            // DataTables disabled - using React rendering instead
        };

        const initDataLoad = () => {
            fetch(route("admin.users.all"))
                .then((r) => r.json())
                .then((json) => initFromData(json))
                .catch((err) => console.error("users fetch error", err));
        };

        let initScriptAppended = false;
        const initLoader = () => initDataLoad();

        if (!script) {
            script = document.createElement("script");
            script.src = jsSrc;
            script.async = true;
            script.onload = () => {
                initScriptAppended = true;
                initLoader();
            };
            document.body.appendChild(script);
        } else {
            initLoader();
        }

        return () => {
            try {
                if (dtRef.current && dtRef.current.destroy) {
                    dtRef.current.destroy();
                    dtRef.current = null;
                    dtInitialized.current = false;
                }
            } catch (e) {}
            if (cssLink) cssLink.remove();
        };
    }, [perPage]);

    const [dtActive, setDtActive] = useState(false);

    const escapeHtml = (unsafe) => {
        if (!unsafe && unsafe !== 0) return "";
        return String(unsafe)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const applyFilters = (
        page = 1,
        customSort = sort,
        customDirection = direction
    ) => {
        router.get(
            route("admin.users"),
            {
                page,
                perPage,
                search,
                role: roleFilter,
                sort: customSort,
                direction: customDirection,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearFilters = () => {
        setSearch("");
        setRoleFilter("");
        setPerPage(25);
        setSort("created_at");
        setDirection("desc");
        applyFilters(1);
    };

    const openModal = (u) => {
        setSelected(u);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelected(null);
    };

    const archiveUser = (u) => {
        setUserToArchive(u);
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
        applyFilters(1, newSort, newDirection);
    };

    return (
        <>
            <FlashMessages />
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-xl text-gray-800">
                            Admin Users
                        </h2>
                        <button
                            onClick={() =>
                                router.visit(
                                    route("admin.archives", { tab: "users" })
                                )
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition text-sm font-medium"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                                />
                            </svg>

                            <span>Archived List</span>
                        </button>
                    </div>
                }
            >
                <div className="py-6">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-3 items-center">
                                    <input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search name or email..."
                                        className="border rounded px-3 py-2 text-sm flex-1 min-w-[200px]"
                                    />
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => {
                                            setRoleFilter(e.target.value);
                                            applyFilters(1);
                                        }}
                                        className="border rounded px-4 py-2 text-sm"
                                    >
                                        <option value="">All Roles</option>
                                        <option value="admin">admin</option>
                                        <option value="supervisor">
                                            supervisor
                                        </option>
                                        <option value="">(none)</option>
                                    </select>
                                    <select
                                        value={perPage}
                                        onChange={(e) => {
                                            setPerPage(e.target.value);
                                            applyFilters(1);
                                        }}
                                        className="border rounded px-5 py-2 text-sm"
                                    >
                                        {[10, 25, 50, 100].map((n) => (
                                            <option key={n} value={n}>
                                                {n} / page
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={clearFilters}
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
                                                className="px-4 py-3 text-left cursor-pointer"
                                                onClick={() =>
                                                    handleSort("name")
                                                }
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
                                                onClick={() =>
                                                    handleSort("email")
                                                }
                                            >
                                                Email{" "}
                                                {sort === "email"
                                                    ? direction === "asc"
                                                        ? "▲"
                                                        : "▼"
                                                    : ""}
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left cursor-pointer"
                                                onClick={() =>
                                                    handleSort("role")
                                                }
                                            >
                                                Role{" "}
                                                {sort === "role"
                                                    ? direction === "asc"
                                                        ? "▲"
                                                        : "▼"
                                                    : ""}
                                            </th>
                                            <th className="px-4 py-3 text-left">
                                                Status
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
                                                    colSpan="5"
                                                    className="px-4 py-6 text-center text-gray-500"
                                                >
                                                    No users found.
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
                                                        <div className="flex flex-col gap-1">
                                                            {Boolean(
                                                                u.banned
                                                            ) && (
                                                                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                                    Platform Ban
                                                                </span>
                                                            )}
                                                            {Boolean(
                                                                u.report_banned
                                                            ) &&
                                                                !Boolean(
                                                                    u.banned
                                                                ) && (
                                                                    <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                                        Posting
                                                                        Ban
                                                                    </span>
                                                                )}
                                                            {!Boolean(
                                                                u.banned
                                                            ) &&
                                                                !Boolean(
                                                                    u.report_banned
                                                                ) && (
                                                                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                                        Active
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-2">
                                                        <div className="flex gap-2 flex-wrap">
                                                            <button
                                                                onClick={() =>
                                                                    openModal(u)
                                                                }
                                                                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
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
                                                                    archiveUser(
                                                                        u
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-2 text-red-600 hover:underline"
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
                                    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden">
                                        <div className="flex justify-between items-center px-6 py-4 bg-black text-white">
                                            <h3 className="text-lg font-semibold">
                                                User Details
                                            </h3>
                                            <button
                                                onClick={closeModal}
                                                className="text-white hover:text-yellow-400"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="px-6 py-4 space-y-4">
                                            {/* Ban Status Section */}
                                            {(selected.banned ||
                                                selected.report_banned) && (
                                                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                                                    <h4 className="font-semibold text-red-900 mb-2">
                                                        Ban Status
                                                    </h4>
                                                    {selected.banned && (
                                                        <div className="text-sm text-red-800 mb-2">
                                                            <p>
                                                                <strong>
                                                                    Platform Ban
                                                                </strong>
                                                            </p>
                                                            <p>
                                                                Reason:{" "}
                                                                {selected.ban_reason ||
                                                                    "No reason provided"}
                                                            </p>
                                                            <p>
                                                                Banned at:{" "}
                                                                {new Date(
                                                                    selected.banned_at
                                                                ).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {selected.report_banned && (
                                                        <div className="text-sm text-orange-800">
                                                            <p>
                                                                <strong>
                                                                    Posting Ban
                                                                </strong>
                                                            </p>
                                                            <p>
                                                                Reason:{" "}
                                                                {selected.report_ban_reason ||
                                                                    "No reason provided"}
                                                            </p>
                                                            <p>
                                                                Banned at:{" "}
                                                                {new Date(
                                                                    selected.report_banned_at
                                                                ).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Name
                                                </label>
                                                <p className="mt-1 text-gray-900">
                                                    {selected.name}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Email
                                                </label>
                                                <p className="mt-1 text-gray-900">
                                                    {selected.email}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Role
                                                </label>
                                                <p className="mt-1 text-gray-900">
                                                    {selected.role || "N/A"}
                                                </p>
                                            </div>
                                            {selected.role_description && (
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700">
                                                        Role Description
                                                    </label>
                                                    <p className="mt-1 text-gray-900">
                                                        {selected.role_description}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="flex justify-end gap-3 flex-wrap pt-4">
                                                {!selected.report_banned ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            closeModal();
                                                            setUserToBan(
                                                                selected
                                                            );
                                                        }}
                                                        className="px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 transition"
                                                    >
                                                        Posting Ban
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            router.post(
                                                                route(
                                                                    "admin.users.unban",
                                                                    selected.id
                                                                )
                                                            );
                                                            closeModal();
                                                        }}
                                                        className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                                                    >
                                                        Lift Posting Ban
                                                    </button>
                                                )}

                                                {!selected.banned ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            closeModal();
                                                            setUserToBanPlatform(
                                                                selected
                                                            );
                                                        }}
                                                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                                                    >
                                                        Platform Ban
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            router.post(
                                                                route(
                                                                    "admin.users.unban-user",
                                                                    selected.id
                                                                )
                                                            );
                                                            closeModal();
                                                        }}
                                                        className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                                                    >
                                                        Lift Platform Ban
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={closeModal}
                                                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            <ConfirmDialog
                open={!!userToArchive}
                onConfirm={() => {
                    // Use Inertia route for archiving
                    router.post(route("admin.users.archive", userToArchive.id));
                    setUserToArchive(null);
                }}
                onCancel={() => setUserToArchive(null)}
                title="Archive User"
                message={`Are you sure you want to archive ${userToArchive?.email}? This action can be undone from the Archive List.`}
                confirmText="Archive"
                cancelText="Cancel"
                variant="warning"
            />

            {userToBan && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 bg-black text-white">
                            <h3 className="text-lg font-semibold">
                                Ban User From Posting
                            </h3>
                            <button
                                onClick={() => {
                                    setUserToBan(null);
                                    setBanReason("");
                                }}
                                className="text-white hover:text-yellow-400"
                            >
                                ✕
                            </button>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                router.post(
                                    route("admin.users.ban", userToBan.id),
                                    { reason: banReason },
                                    {
                                        onSuccess: () => {
                                            setUserToBan(null);
                                            setBanReason("");
                                        },
                                    }
                                );
                            }}
                            className="px-6 py-4 space-y-4"
                        >
                            <div>
                                <p className="text-sm text-gray-600 mb-2">
                                    User:{" "}
                                    <span className="font-semibold">
                                        {userToBan.name}
                                    </span>{" "}
                                    ({userToBan.email})
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Ban Reason
                                </label>
                                <textarea
                                    value={banReason}
                                    onChange={(e) =>
                                        setBanReason(e.target.value)
                                    }
                                    placeholder="Explain why this user is being banned (e.g., repeated trolling, harassment, spam...)"
                                    className="w-full border rounded px-3 py-2 h-24"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUserToBan(null);
                                        setBanReason("");
                                    }}
                                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                                >
                                    Ban User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {userToBanPlatform && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 bg-red-600 text-white">
                            <h3 className="text-lg font-semibold">
                                Ban User From Platform
                            </h3>
                            <button
                                onClick={() => {
                                    setUserToBanPlatform(null);
                                    setPlatformBanReason("");
                                }}
                                className="text-white hover:text-yellow-400"
                            >
                                ✕
                            </button>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                router.post(
                                    route(
                                        "admin.users.ban-user",
                                        userToBanPlatform.id
                                    ),
                                    { reason: platformBanReason },
                                    {
                                        onSuccess: () => {
                                            setUserToBanPlatform(null);
                                            setPlatformBanReason("");
                                        },
                                    }
                                );
                            }}
                            className="px-6 py-4 space-y-4"
                        >
                            <div>
                                <p className="text-sm text-gray-600 mb-2">
                                    User:{" "}
                                    <span className="font-semibold">
                                        {userToBanPlatform.name}
                                    </span>{" "}
                                    ({userToBanPlatform.email})
                                </p>
                                <p className="text-sm text-red-600 font-medium">
                                    This will prevent the user from posting
                                    reports, commenting, voting, and all other
                                    platform activities.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Ban Reason
                                </label>
                                <textarea
                                    value={platformBanReason}
                                    onChange={(e) =>
                                        setPlatformBanReason(e.target.value)
                                    }
                                    placeholder="Explain why this user is being banned from the platform..."
                                    className="w-full border rounded px-3 py-2 h-24"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUserToBanPlatform(null);
                                        setPlatformBanReason("");
                                    }}
                                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                                >
                                    Ban From Platform
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
