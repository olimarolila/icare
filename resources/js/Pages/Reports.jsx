import Navbar from "@/Components/Navbar";
import { router } from "@inertiajs/react";
import { useState } from "react";

const ReportCard = ({ report, auth }) => {
    const submittedDate = report.submitted_at
        ? new Date(report.submitted_at)
        : null;
    const dateStr = submittedDate ? submittedDate.toLocaleDateString() : "—";
    const timeStr = submittedDate
        ? submittedDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
          })
        : "";
    const images = Array.isArray(report.images)
        ? report.images.slice(0, 3)
        : [];

    return (
        <section className="w-full max-w-5xl mt-5" key={report.id}>
            <div className="bg-neutral-900/95 text-gray-100 rounded-xl border border-white/10 shadow-xl p-6 md:p-8">
                <div className="grid grid-cols-1 md:flex md:items-center md:justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-sm font-semibold">
                            {(report.user?.name || "Guest")
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
                            <span className="font-semibold">
                                {report.user?.name || "Guest"}
                            </span>
                            <span className="text-gray-500">|</span>
                            <span className="text-gray-300">
                                {report.category}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-end md:justify-end gap-4 text-xs md:text-sm text-gray-300">
                        <div className="text-sm md:text-base text-gray-300 whitespace-nowrap font-mono">
                            {dateStr} {timeStr && `| ${timeStr}`}
                        </div>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-200 px-1"
                            aria-label="menu"
                        >
                            •••
                        </button>
                    </div>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-3">
                    {report.subject}
                </h2>
                <p className="text-sm md:text-base text-gray-200 leading-relaxed mb-6 text-justify">
                    {report.description || "No description provided."}
                </p>
                {images.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {images.map((img, idx) => (
                            <img
                                key={idx}
                                src={`/storage/${img}`}
                                alt={`Report Image ${idx + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-white/10"
                            />
                        ))}
                    </div>
                )}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-black/40 rounded-full px-4 py-2">
                            <button
                                type="button"
                                className="flex items-center justify-center"
                                aria-label="upvote"
                                onClick={() => {
                                    if (!auth?.user) {
                                        alert("Please log in to vote.");
                                        return;
                                    }
                                    router.post(
                                        route("reports.vote", report.id),
                                        { direction: "up" },
                                        { preserveScroll: true }
                                    );
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    className="w-4 h-4"
                                    fill="currentColor"
                                >
                                    <path d="M10 19a3.966 3.966 0 01-3.96-3.962V10.98H2.838a1.731 1.731 0 01-1.605-1.073 1.734 1.734 0 01.377-1.895L9.364.254a.925.925 0 011.272 0l7.754 7.759c.498.499.646 1.242.376 1.894-.27.652-.9 1.073-1.605 1.073h-3.202v4.058A3.965 3.965 0 019.999 19H10zM2.989 9.179H7.84v5.731c0 1.13.81 2.163 1.934 2.278a2.163 2.163 0 002.386-2.15V9.179h4.851L10 2.163 2.989 9.179z" />
                                </svg>
                            </button>
                            <span className="text-sm">{report.votes ?? 0}</span>
                            <button
                                type="button"
                                className="flex items-center justify-center"
                                aria-label="downvote"
                                onClick={() => {
                                    if (!auth?.user) {
                                        alert("Please log in to vote.");
                                        return;
                                    }
                                    router.post(
                                        route("reports.vote", report.id),
                                        { direction: "down" },
                                        { preserveScroll: true }
                                    );
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    className="w-4 h-4"
                                    fill="currentColor"
                                >
                                    <path d="M10 1a3.966 3.966 0 013.96 3.962V9.02h3.202c.706 0 1.335.42 1.605 1.073.27.652.122 1.396-.377 1.895l-7.754 7.759a.925.925 0 01-1.272 0l-7.754-7.76a1.734 1.734 0 01-.376-1.894c.27-.652.9-1.073 1.605-1.073h3.202V4.962A3.965 3.965 0 0110 1zm7.01 9.82h-4.85V5.09c0-1.13-.81-2.163-1.934-2.278a2.163 2.163 0 00-2.386 2.15v5.859H2.989l7.01 7.016 7.012-7.016z" />
                                </svg>
                            </button>
                        </div>
                        <button
                            type="button"
                            className="flex items-center gap-2 bg-black/40 rounded-full px-4 py-2"
                            aria-label="comments"
                            onClick={() => {
                                const el = document.getElementById(
                                    `comments-${report.id}`
                                );
                                if (el) el.classList.toggle("hidden");
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                className="w-4 h-4"
                                fill="currentColor"
                            >
                                <path d="M10 1a9 9 0 00-9 9c0 1.947.79 3.58 1.935 4.957L.231 17.661A.784.784 0 00.785 19H10a9 9 0 009-9 9 9 0 00-9-9zm0 16.2H6.162c-.994.004-1.907.053-3.045.144l-.076-.188a36.981 36.981 0 002.328-2.087l-1.05-1.263C3.297 12.576 2.8 11.331 2.8 10c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2z" />
                            </svg>
                            <span className="text-sm">
                                {report.comments_count ??
                                    (Array.isArray(report.comments)
                                        ? report.comments.length
                                        : 0)}
                            </span>
                        </button>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:gap-8 text-sm text-gray-300">
                        <span className="font-medium">
                            Status:{" "}
                            <span className="font-normal">{report.status}</span>
                        </span>
                        <span className="font-medium">
                            Ticket I.D.:{" "}
                            <span className="font-mono">
                                {report.ticket_id}
                            </span>
                        </span>
                    </div>
                </div>
                {/* Comments Section */}
                <div id={`comments-${report.id}`} className="hidden mt-4">
                    <div className="space-y-3">
                        {Array.isArray(report.comments) &&
                        report.comments.length > 0 ? (
                            report.comments.map((c) => (
                                <div
                                    key={c.id}
                                    className="bg-black/30 border border-white/10 rounded-lg p-3"
                                >
                                    <div className="text-xs text-gray-400 mb-1">
                                        <span className="font-semibold">
                                            {c.user?.name ?? "User"}
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span>
                                            {new Date(
                                                c.created_at
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-100">
                                        {c.body}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-400 italic">
                                No comments yet.
                            </div>
                        )}
                    </div>
                    <form
                        className="mt-3 flex items-center gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!auth?.user) {
                                alert("Please log in to comment.");
                                return;
                            }
                            const form = e.currentTarget;
                            const input =
                                form.querySelector('input[name="body"]');
                            const body = input?.value?.trim();
                            if (!body) return;
                            router.post(
                                route("reports.comment", report.id),
                                { body },
                                {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        if (input) input.value = "";
                                    },
                                }
                            );
                        }}
                    >
                        <input
                            type="text"
                            name="body"
                            className="flex-1 px-3 py-2 rounded-lg bg-white/90 text-black placeholder-gray-500"
                            placeholder={
                                auth?.user
                                    ? "Add a comment..."
                                    : "Log in to comment"
                            }
                            disabled={!auth?.user}
                            maxLength={500}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg disabled:opacity-50"
                            disabled={!auth?.user}
                        >
                            Post
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default function Reports({ auth, reports = [] }) {
    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-fixed text-white"
            style={{ backgroundImage: "url('/images/bg (reports).jpg')" }}
        >
            <Navbar auth={auth} />
            <main className="relative z-10 min-h-[80vh] px-6 md:px-16 lg:px-32 py-10 flex flex-col items-center">
                {reports.length === 0 && (
                    <p className="mt-10 text-white/80 italic">
                        No reports submitted yet.
                    </p>
                )}
                {reports.map((r) => (
                    <ReportCard key={r.id} report={r} auth={auth} />
                ))}
            </main>
        </div>
    );
}
