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
    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "",
        role_description: "",
    });

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

    // DataTables integration (client-side over all users)
    useEffect(() => {
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
            try {
                if (window.DataTable && !dtInitialized.current) {
                    const table = document.getElementById("users-table");
                    if (table) {
                        // clear existing tbody
                        const tbody = table.querySelector("tbody");
                        tbody.innerHTML = "";
                        data.forEach((u) => {
                            const tr = document.createElement("tr");
                            tr.className = "border-b";
                            tr.innerHTML = `
                                <td class="px-4 py-2">${escapeHtml(u.name)}</td>
                                <td class="px-4 py-2">${escapeHtml(
                                    u.email
                                )}</td>
                                <td class="px-4 py-2">${escapeHtml(
                                    u.role || "-"
                                )}</td>
                                <td class="px-4 py-2"><div class="flex gap-2"><a href="${route(
                                    "admin.users.edit",
                                    u.id
                                )}" class="text-blue-600 hover:underline">Edit</a> <button data-id="${
                                u.id
                            }" data-email="${escapeHtml(
                                u.email
                            )}" class="text-red-600 hover:underline archive-btn">Archive</button></div></td>
                            `;
                            tbody.appendChild(tr);
                        });

                        // eslint-disable-next-line no-undef
                        dtRef.current = new window.DataTable(table, {
                            perPage: Number(perPage) || 25,
                            searchable: true,
                            sortable: true,
                        });
                        dtInitialized.current = true;
                        setDtActive(true);

                        // attach archive handlers
                        table
                            .querySelectorAll(".archive-btn")
                            .forEach((btn) => {
                                btn.addEventListener("click", (e) => {
                                    const id = btn.getAttribute("data-id");
                                    const email =
                                        btn.getAttribute("data-email");
                                    // Find user from data and trigger dialog
                                    setUserToArchive({ id, email });
                                });
                            });
                    }
                }
            } catch (e) {
                console.error("DataTable init error", e);
            }
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

    const applyFilters = (page = 1) => {
        router.get(
            route("admin.users"),
            { page, perPage, search, role: roleFilter, sort, direction },
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
        setForm({
            name: u.name || "",
            email: u.email || "",
            role: u.role || "",
            role_description: u.role_description || "",
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelected(null);
    };

    const submitUpdate = (e) => {
        e.preventDefault();
        if (!selected) return;
        router.patch(route("admin.users.update", selected.id), form, {
            onSuccess: () => closeModal(),
        });
    };

    const archiveUser = (u) => {
        setUserToArchive(u);
    };

    const handleSort = (col) => {
        if (sort === col) {
            setDirection(direction === "asc" ? "desc" : "asc");
        } else {
            setSort(col);
            setDirection("asc");
        }
        // trigger
        setTimeout(() => applyFilters(1), 0);
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
                                            value={roleFilter}
                                            onChange={(e) => {
                                                setRoleFilter(e.target.value);
                                                applyFilters(1);
                                            }}
                                            className="border rounded px-5 py-2 text-sm"
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
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="4"
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
                                                        <div className="flex gap-2">
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
                                                                    stroke-width="1.5"
                                                                    stroke="currentColor"
                                                                    class="size-6"
                                                                >
                                                                    <path
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
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
                            <div
                                className="flex items-center justify-end mt-4"
                                style={{ display: dtActive ? "none" : "flex" }}
                            >
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
                                                Edit User
                                            </h3>
                                            <button
                                                onClick={closeModal}
                                                className="text-white hover:text-yellow-400"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <form
                                            onSubmit={submitUpdate}
                                            className="px-6 py-4 space-y-4"
                                        >
                                            <div>
                                                <label className="block text-sm text-gray-600">
                                                    Name
                                                </label>
                                                <input
                                                    value={form.name}
                                                    onChange={(e) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            name: e.target
                                                                .value,
                                                        }))
                                                    }
                                                    className="w-full border rounded px-3 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600">
                                                    Email
                                                </label>
                                                <input
                                                    value={form.email}
                                                    onChange={(e) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            email: e.target
                                                                .value,
                                                        }))
                                                    }
                                                    className="w-full border rounded px-3 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600">
                                                    Role
                                                </label>
                                                <input
                                                    value={form.role}
                                                    onChange={(e) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            role: e.target
                                                                .value,
                                                        }))
                                                    }
                                                    className="w-full border rounded px-3 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600">
                                                    Role Description
                                                </label>
                                                <input
                                                    value={
                                                        form.role_description
                                                    }
                                                    onChange={(e) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            role_description:
                                                                e.target.value,
                                                        }))
                                                    }
                                                    className="w-full border rounded px-3 py-2"
                                                />
                                            </div>
                                            <div className="flex justify-end gap-3">
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
                    const userId = userToArchive.id;

                    // Check if this is from DataTables (when we only have id and email)
                    if (dtActive && typeof userId === "string") {
                        // Use fetch for DataTables integration
                        fetch(route("admin.users.destroy", userId), {
                            method: "DELETE",
                            headers: {
                                "X-CSRF-TOKEN": document
                                    .querySelector('meta[name="csrf-token"]')
                                    .getAttribute("content"),
                                Accept: "application/json",
                            },
                        }).then((r) => {
                            if (r.ok) {
                                // Reload DataTable
                                try {
                                    dtRef.current.destroy();
                                } catch (e) {}
                                dtInitialized.current = false;
                                setDtActive(false);
                                setTimeout(() => {
                                    fetch(route("admin.users.all"))
                                        .then((r) => r.json())
                                        .then((data) => {
                                            if (window.DataTable) {
                                                const initFromData = (data) => {
                                                    const table =
                                                        document.getElementById(
                                                            "users-table"
                                                        );
                                                    if (table) {
                                                        const tbody =
                                                            table.querySelector(
                                                                "tbody"
                                                            );
                                                        tbody.innerHTML = "";
                                                        data.forEach((u) => {
                                                            const tr =
                                                                document.createElement(
                                                                    "tr"
                                                                );
                                                            tr.className =
                                                                "border-b";
                                                            tr.innerHTML = `
                                                                <td class="px-4 py-2">${escapeHtml(
                                                                    u.name
                                                                )}</td>
                                                                <td class="px-4 py-2">${escapeHtml(
                                                                    u.email
                                                                )}</td>
                                                                <td class="px-4 py-2">${escapeHtml(
                                                                    u.role ||
                                                                        "-"
                                                                )}</td>
                                                                <td class="px-4 py-2"><div class="flex gap-2"><a href="${route(
                                                                    "admin.users.edit",
                                                                    u.id
                                                                )}" class="text-blue-600 hover:underline">Edit</a> <button data-id="${
                                                                u.id
                                                            }" data-email="${escapeHtml(
                                                                u.email
                                                            )}" class="text-red-600 hover:underline archive-btn">Archive</button></div></td>
                                                            `;
                                                            tbody.appendChild(
                                                                tr
                                                            );
                                                        });
                                                        dtRef.current =
                                                            new window.DataTable(
                                                                table,
                                                                {
                                                                    perPage:
                                                                        Number(
                                                                            perPage
                                                                        ) || 25,
                                                                    searchable: true,
                                                                    sortable: true,
                                                                }
                                                            );
                                                        dtInitialized.current = true;
                                                        setDtActive(true);

                                                        // Re-attach handlers
                                                        table
                                                            .querySelectorAll(
                                                                ".archive-btn"
                                                            )
                                                            .forEach((btn) => {
                                                                btn.addEventListener(
                                                                    "click",
                                                                    (e) => {
                                                                        const id =
                                                                            btn.getAttribute(
                                                                                "data-id"
                                                                            );
                                                                        const email =
                                                                            btn.getAttribute(
                                                                                "data-email"
                                                                            );
                                                                        setUserToArchive(
                                                                            {
                                                                                id,
                                                                                email,
                                                                            }
                                                                        );
                                                                    }
                                                                );
                                                            });
                                                    }
                                                };
                                                initFromData(data);
                                            }
                                        });
                                }, 200);
                            }
                        });
                    } else {
                        // Regular Inertia route for pagination view
                        router.post(route("admin.users.archive", userId));
                    }

                    setUserToArchive(null);
                }}
                onCancel={() => setUserToArchive(null)}
                title="Archive User"
                message={`Are you sure you want to archive ${userToArchive?.email}? This action can be undone from the Archive List.`}
                confirmText="Archive"
                cancelText="Cancel"
                variant="warning"
            />
        </>
    );
}
