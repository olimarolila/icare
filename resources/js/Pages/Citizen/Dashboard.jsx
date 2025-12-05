import { Head, Link } from "@inertiajs/react";
import CitizenLayout from "@/Layouts/CitizenLayout";

const statusStyles = {
    Pending: "bg-yellow-500/20 text-yellow-200 border border-yellow-500/40",
    "In Progress": "bg-blue-500/20 text-blue-200 border border-blue-500/40",
    Resolved: "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40",
};

const formatDate = (value) =>
    value
        ? new Date(value).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
          })
        : "—";

export default function CitizenDashboard({ reports = [] }) {
    const hasReports = reports.length > 0;
    const pendingCount = reports.filter((r) => r.status === "Pending").length;
    const inProgressCount = reports.filter((r) => r.status === "In Progress").length;
    const resolvedCount = reports.filter((r) => r.status === "Resolved").length;
    const summaryCards = [
        {
            label: "Total Reports",
            value: reports.length,
            accent: "text-white",
        },
        { label: "Pending", value: pendingCount, accent: "text-yellow-300" },
        {
            label: "In Progress",
            value: inProgressCount,
            accent: "text-blue-300",
        },
        { label: "Resolved", value: resolvedCount, accent: "text-emerald-300" },
    ];

    return (
        <CitizenLayout fullBleed>
            <Head title="My Reports" />
            <div className="relative min-h-screen text-white">
                <div
                    aria-hidden
                    className="pointer-events-none fixed inset-0 -z-10"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-fixed"
                        style={{ backgroundImage: "url('/images/bg (reports).jpg')" }}
                    />
                </div>

                <div className="relative z-10 min-h-[80vh] px-6 md:px-12 lg:px-20 xl:px-24 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        <div className="md:col-span-4 lg:col-span-4 xl:col-span-3">
                            <aside className="bg-neutral-900/90 border border-white/10 rounded-2xl shadow-2xl p-6 space-y-6">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                                        Citizen Desk
                                    </p>
                                    <h1 className="mt-2 text-3xl font-extrabold leading-tight">
                                        TRACK YOUR REPORTS
                                    </h1>
                                    <div className="h-1 w-24 bg-white mt-4" />
                                    <p className="mt-4 text-sm text-white/80">
                                        Monitor every submission at a glance, see how barangay staff are responding,
                                        and jump back into the reporting flow when you have new concerns.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    {summaryCards.map((card) => (
                                        <div
                                            key={card.label}
                                            className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3"
                                        >
                                            <span className="text-sm text-white/70">{card.label}</span>
                                            <span className={`text-2xl font-semibold ${card.accent}`}>
                                                {card.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    <Link
                                        href={route("reports")}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
                                    >
                                        File a new report
                                    </Link>
                                    <div className="bg-black/30 border border-white/10 rounded-xl p-4 space-y-2 text-sm text-white/70">
                                        <p className="text-white/85 font-semibold">Need help?</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Tap a ticket to review the full submission.</li>
                                            <li>Statuses update as soon as barangay staff take action.</li>
                                            <li>Contact support if a report stays pending too long.</li>
                                        </ul>
                                    </div>
                                </div>
                            </aside>
                        </div>
                        <div className="md:col-span-8 lg:col-span-8 xl:col-span-9 flex flex-col space-y-6">
                            <section className="bg-neutral-900/95 border border-white/10 rounded-2xl shadow-2xl p-6">
                                <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-white">
                                            My Submitted Reports
                                        </h2>
                                        <p className="text-sm text-white/70">
                                            Detailed status, timestamps, and categories for every submission.
                                        </p>
                                    </div>
                                </div>

                                {hasReports ? (
                                    <div className="mt-6 overflow-x-auto">
                                        <table className="min-w-full divide-y divide-white/10 text-sm">
                                            <thead>
                                                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-white/70">
                                                    <th className="px-4 py-3">Ticket</th>
                                                    <th className="px-4 py-3">Subject</th>
                                                    <th className="px-4 py-3">Category</th>
                                                    <th className="px-4 py-3">Street</th>
                                                    <th className="px-4 py-3">Submitted</th>
                                                    <th className="px-4 py-3 text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-white/90">
                                                {reports.map((report) => (
                                                    <tr key={report.id}>
                                                        <td className="px-4 py-3 font-mono text-xs text-white/70">
                                                            {report.ticket_id || "—"}
                                                        </td>
                                                        <td className="px-4 py-3 font-semibold text-white">
                                                            {report.subject || "Untitled"}
                                                        </td>
                                                        <td className="px-4 py-3">{report.category || "—"}</td>
                                                        <td className="px-4 py-3">{report.street || "—"}</td>
                                                        <td className="px-4 py-3">
                                                            {formatDate(report.submitted_at || report.created_at)}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span
                                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                                    statusStyles[report.status] ||
                                                                    "bg-white/10 text-white border border-white/20"
                                                                }`}
                                                            >
                                                                {report.status || "Unknown"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="mt-6 rounded-xl border border-dashed border-white/20 bg-black/30 p-8 text-center text-white/80">
                                        <p className="text-lg font-semibold">No reports yet</p>
                                        <p className="mt-2 text-sm">
                                            Once you submit a report, you will be able to track it here.
                                        </p>
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </CitizenLayout>
    );
}
