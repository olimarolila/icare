import CitizenLayout from "@/Layouts/CitizenLayout";
import FlashMessages from "@/Components/FlashMessages";
import { Head, Link } from "@inertiajs/react";
import { ReportCard } from "../Reports";

export default function VoteFeed({
    auth,
    reports = { data: [], links: [] },
    emptyMessage = "No posts yet.",
    heading = "Your Votes",
    subheading = "",
}) {
    const reportList = Array.isArray(reports?.data) ? reports.data : [];
    const paginationLinks = Array.isArray(reports?.links) ? reports.links : [];

    return (
        <CitizenLayout>
            <Head title={heading} />
            <FlashMessages />
            <div className="mx-auto flex w-full max-w-6xl flex-col space-y-6">
                <div className="rounded-2xl border border-white/10 bg-neutral-950/80 px-6 py-5 shadow-[0_20px_45px_rgba(0,0,0,0.55)] backdrop-blur">
                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                        {heading}
                    </h1>
                    {subheading && (
                        <p className="mt-1 text-sm text-white/65">{subheading}</p>
                    )}
                </div>

                {reportList.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/20 bg-black/50 px-6 py-16 text-center text-white/60">
                        {emptyMessage}
                    </div>
                ) : (
                    reportList.map((report) => (
                        <ReportCard key={report.id} report={report} auth={auth} />
                    ))
                )}

                {paginationLinks.length > 0 && (
                    <div className="flex w-full items-center justify-end">
                        <div className="flex flex-wrap gap-2">
                            {paginationLinks.map((link, idx) =>
                                link.url ? (
                                    <Link
                                        key={`${link.label}-${idx}`}
                                        href={link.url}
                                        preserveScroll
                                        className={`px-3 py-1 rounded text-sm border transition ${
                                            link.active
                                                ? "bg-white text-black border-white"
                                                : "bg-transparent text-white border-white/40 hover:bg-white hover:text-black"
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={`${link.label}-${idx}`}
                                        className="px-3 py-1 rounded text-sm border border-white/20 text-white/30"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </CitizenLayout>
    );
}
