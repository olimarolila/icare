import { Head, Link } from "@inertiajs/react";
import CitizenLayout from "@/Layouts/CitizenLayout";

const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Resolved: "bg-green-100 text-green-800",
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

    return (
        <CitizenLayout>
            <Head title="My Reports" />

            <section className="rounded-2xl bg-white/90 p-6 shadow-md">
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            My Submitted Reports
                        </h1>
                        <p className="text-sm text-gray-500">
                            Monitor the status of every report you have filed.
                        </p>
                    </div>
                    <Link
                        href={route("report.form")}
                        className="inline-flex items-center justify-center rounded-md bg-yellow-400 px-4 py-2 font-semibold text-black transition hover:bg-yellow-300"
                    >
                        + New Report
                    </Link>
                </div>

                {hasReports ? (
                    <div className="mt-6 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    <th className="px-4 py-3">Ticket</th>
                                    <th className="px-4 py-3">Subject</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Street</th>
                                    <th className="px-4 py-3">Submitted</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reports.map((report) => (
                                    <tr key={report.id} className="text-sm text-gray-700">
                                        <td className="px-4 py-3 font-mono text-xs">
                                            {report.ticket_id || "—"}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {report.subject || "Untitled"}
                                        </td>
                                        <td className="px-4 py-3">{report.category || "—"}</td>
                                        <td className="px-4 py-3">{report.street || "—"}</td>
                                        <td className="px-4 py-3">{formatDate(report.submitted_at || report.created_at)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    statusStyles[report.status] || "bg-gray-100 text-gray-700"
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
                    <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white/70 p-8 text-center text-gray-600">
                        <p className="text-lg font-semibold">No reports yet</p>
                        <p className="mt-2 text-sm">
                            Once you submit a report, you will be able to track it here.
                        </p>
                        <Link
                            href={route("report.form")}
                            className="mt-4 inline-flex items-center justify-center rounded-md border border-yellow-400 px-4 py-2 font-semibold text-yellow-600 transition hover:bg-yellow-50"
                        >
                            File your first report
                        </Link>
                    </div>
                )}
            </section>
        </CitizenLayout>
    );
}
