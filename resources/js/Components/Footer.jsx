// resources/js/Components/Footer.jsx
import React from "react";
import { Link } from "@inertiajs/react";

export default function Footer() {
    return (
        <footer className="w-full bg-black text-neutral-300 border-t border-white/10">
            {/* made it full-width + smaller vertical padding */}
            <div className="w-full mx-auto px-6 md:px-12 lg:px-20 py-6">
                <div className="grid gap-6 lg:gap-8 md:grid-cols-3 items-start">
                    {/* Brand + blurb */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-black text-lg">
                                i
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white tracking-wide">
                                    iCARE
                                </p>
                                <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">
                                    Integrated Community Assistance &amp;
                                    Reporting Environment
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-neutral-400 max-w-sm">
                            A civic reporting platform that turns everyday
                            issues into actionable tickets for a more responsive
                            and transparent community.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                            Quick links
                        </h3>
                        <div className="flex flex-col gap-1.5 text-sm">
                            <Link
                                href={route("report.form")}
                                className="hover:text-yellow-400 transition"
                            >
                                Submit a report
                            </Link>
                            <Link
                                href={route("reports")}
                                className="hover:text-yellow-400 transition"
                            >
                                Browse reports
                            </Link>
                            <Link
                                href={route("about")}
                                className="hover:text-yellow-400 transition"
                            >
                                About iCARE
                            </Link>
                            <Link
                                href={route("login")}
                                className="hover:text-yellow-400 transition"
                            >
                                Login
                            </Link>
                        </div>
                    </div>

                    {/* Badges / small info */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                            Why iCARE?
                        </h3>
                        <p className="text-sm text-neutral-400 max-w-sm">
                            Managed by local authorities with real-time
                            dashboards for tracking pending, in-progress, and
                            resolved tickets—built to support accountable and
                            data-driven governance.
                        </p>
                        <div className="flex flex-wrap gap-2 text-[11px]">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-200">
                                Community-driven
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-200">
                                Ticket-based tracking
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-200">
                                Transparent metrics
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom bar – less spacing */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-neutral-500">
                    <p>
                        © {new Date().getFullYear()} iCARE. All rights reserved.
                    </p>
                    <p>Built for safer, more responsive communities.</p>
                </div>
            </div>
        </footer>
    );
}
