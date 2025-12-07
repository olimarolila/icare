import React, { useState, useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import Footer from "@/Components/Footer";
import FlashMessages from "@/Components/FlashMessages";
import Navbar from "@/Components/Navbar";

export default function Welcome({
    auth,
    reports = [],
    statusCounts = { resolved: 0, inProgress: 0, pending: 0 },
}) {
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeStep, setActiveStep] = useState("submit");

    const steps = {
        submit: {
            label: "Submit a report",
            badge: "Residents",
            description:
                "Citizens submit issues such as damaged pavements, broken streetlights, and flooding. Each report includes a photo, location, and short description, so local authorities see exactly what needs attention.",
        },
        ticket: {
            label: "Ticket is created",
            badge: "System",
            description:
                "Every submission becomes a trackable ticket inside iCARE, with a unique ID and a clear status: Pending, In Progress, or Resolved. This keeps both residents and LGU staff on the same page.",
        },
        action: {
            label: "Authorities take action",
            badge: "LGU / Agencies",
            description:
                "Local authorities review tickets, assign them to the right departments, and update the status as work progresses. Notes and updates can be logged along the way for better context.",
        },
        insights: {
            label: "Progress & insights",
            badge: "Admin Dashboard",
            description:
                "The admin dashboard shows real-time metrics such as total reports, average response and resolution times, and heatmaps of recurring problem areas—helping leaders prioritize resources and demonstrate accountability.",
        },
    };

    const stepOrder = ["submit", "ticket", "action", "insights"];

    const openModal = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedReport(null);
        setSelectedImage(null);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) =>
            prev > 0 ? prev - 2 : Math.max(0, reports.length - 2)
        );
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 2 < reports.length ? prev + 2 : 0));
    };

    // Hook: detect when element is in view once
    const useInView = (options) => {
        const [isInView, setIsInView] = useState(false);
        const ref = useRef(null);
        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                },
                { threshold: 0.3, ...options }
            );
            if (ref.current) observer.observe(ref.current);
            return () => observer.disconnect();
        }, [ref]);
        return [ref, isInView];
    };

    // Hook: count-up animation
    const useCountUp = (end, start) => {
        const [val, setVal] = useState(0);
        useEffect(() => {
            if (!start) return;
            let current = 0;
            const duration = 1200;
            const step = end / (duration / 16.67);
            const tick = () => {
                current += step;
                if (current < end) {
                    setVal(Math.floor(current));
                    requestAnimationFrame(tick);
                } else {
                    setVal(end);
                }
            };
            requestAnimationFrame(tick);
        }, [start, end]);
        return val;
    };

    const [counterRef, countersVisible] = useInView();
    // Use statusCounts from props for accurate numbers
    const resolved = useCountUp(statusCounts.resolved, countersVisible);
    const progress = useCountUp(statusCounts.inProgress, countersVisible);
    const pending = useCountUp(statusCounts.pending, countersVisible);

    return (
        <>
            <FlashMessages />
            {/* Hero */}
            <div
                className="relative min-h-screen bg-cover bg-center text-white"
                style={{ backgroundImage: "url('/images/bg (homepage).jpg')" }}
            >
                <Navbar auth={auth} />
                <main className="relative z-10 flex flex-col items-start justify-center min-h-[80vh] px-8 md:px-32 lg:px-40">
                    <img
                        src="/images/icare.png"
                        alt="iCARE"
                        className="h-28 md:h-40 lg:h-52 object-contain mb-6 drop-shadow-lg"
                    />
                    <p className="text-base md:text-lg lg:text-2xl leading-snug max-w-xl">
                        Because caring for the community starts with you and
                        together, we will make a difference.
                    </p>
                </main>
            </div>

            {/* Counters */}
            <section className="w-full px-8 md:px-20 lg:px-40 relative z-20">
                <div
                    ref={counterRef}
                    className="bg-black text-white rounded-3xl shadow-2xl p-10 -mt-20 md:-mt-24 lg:-mt-28 relative z-30 border border-white/10"
                >
                    <h2 className="text-3xl md:text-4xl font-semibold mb-10">
                        Report Status Overview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/10 rounded-2xl p-8 text-center border border-white/20">
                            <h3 className="text-xl font-semibold">Resolved</h3>
                            <p className="text-5xl font-bold text-green-400 mt-3">
                                {resolved}
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-8 text-center border border-white/20">
                            <h3 className="text-xl font-semibold">
                                In Progress
                            </h3>
                            <p className="text-5xl font-bold text-blue-300 mt-3">
                                {progress}
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-8 text-center border border-white/20">
                            <h3 className="text-xl font-semibold">Pending</h3>
                            <p className="text-5xl font-bold text-yellow-300 mt-3">
                                {pending}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-20 px-6 md:px-20 lg:px-40">
                <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
                    {/* LEFT: Text + Highlights */}
                    <div className="space-y-6">
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-yellow-500">
                            About the Platform
                        </p>
                        <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900">
                            What is iCARE?
                        </h2>
                        <p className="text-sm md:text-base text-neutral-700 leading-relaxed">
                            <span className="font-semibold">
                                Integrated Community Assistance &amp; Reporting
                                Environment (iCARE)
                            </span>{" "}
                            is a web-based civic reporting platform where
                            citizens can submit local issues—such as damaged
                            pavements, broken streetlights, or flooding—
                            complete with photos, location, and descriptions.
                            Each submission becomes a trackable ticket managed
                            by local authorities.
                        </p>
                        <p className="text-sm md:text-base text-neutral-700 leading-relaxed">
                            Through a centralized admin dashboard, iCARE
                            provides real-time visibility into community
                            concerns with{" "}
                            <span className="font-semibold">
                                total report counts, average response and
                                resolution times, and heatmaps of incident
                                locations
                            </span>
                            . This helps promote accountable governance,
                            transparent service delivery, and a stronger link
                            between residents and their LGU.
                        </p>

                        {/* Highlight Cards */}
                        <div className="grid gap-4 sm:grid-cols-3 pt-4">
                            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">
                                    Reports
                                </p>
                                <p className="text-lg font-semibold text-neutral-900">
                                    Issue-based tickets
                                </p>
                                <p className="text-xs text-neutral-600 mt-2">
                                    Residents log real-world issues with photos
                                    and mapped locations.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">
                                    Status Tracking
                                </p>
                                <p className="text-lg font-semibold text-neutral-900">
                                    Pending → Resolved
                                </p>
                                <div className="flex gap-1 flex-wrap mt-2 text-[11px]">
                                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                                        Pending
                                    </span>
                                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                        In Progress
                                    </span>
                                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">
                                        Resolved
                                    </span>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">
                                    Insights
                                </p>
                                <p className="text-lg font-semibold text-neutral-900">
                                    Real-time metrics
                                </p>
                                <p className="text-xs text-neutral-600 mt-2">
                                    Dashboards show hotspots, response times,
                                    and trends over time.
                                </p>
                            </div>
                        </div>

                        {/* Call to action */}
                        <div className="flex flex-wrap gap-3 pt-4">
                            <Link
                                href={route("about")}
                                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition"
                            >
                                Learn more about iCARE
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT: Interactive Flow */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-b from-yellow-100/40 via-transparent to-transparent rounded-3xl pointer-events-none" />
                        <div className="relative rounded-3xl border border-neutral-200 bg-white shadow-lg p-5 md:p-6 space-y-4">
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <h3 className="text-sm font-semibold text-neutral-900">
                                    How iCARE works
                                </h3>
                                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-medium text-white">
                                    Live ticket journey
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                </span>
                            </div>

                            {/* Step Tabs */}
                            <div className="flex flex-wrap gap-2 text-xs">
                                {stepOrder.map((key) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setActiveStep(key)}
                                        className={`px-3 py-1.5 rounded-full border transition text-left ${
                                            activeStep === key
                                                ? "bg-neutral-900 text-white border-neutral-900"
                                                : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                                        }`}
                                    >
                                        {steps[key].label}
                                    </button>
                                ))}
                            </div>

                            {/* Active Step Content */}
                            <div className="mt-3 rounded-2xl bg-neutral-950 text-white p-4 space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold">
                                        {steps[activeStep].label}
                                    </p>
                                    <span className="px-2.5 py-1 text-[11px] rounded-full bg-white/10 border border-white/20">
                                        {steps[activeStep].badge}
                                    </span>
                                </div>

                                <p className="text-xs md:text-sm text-neutral-100/90 leading-relaxed">
                                    {steps[activeStep].description}
                                </p>

                                {/* Mini ticket preview */}
                                <div className="mt-2 rounded-xl bg-neutral-900/80 border border-white/10 p-3 space-y-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-[11px] text-neutral-300">
                                            Ticket ID: IC-2314
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                activeStep === "submit"
                                                    ? "bg-yellow-500/20 text-yellow-300"
                                                    : activeStep === "ticket"
                                                    ? "bg-blue-500/20 text-blue-300"
                                                    : activeStep === "action"
                                                    ? "bg-blue-500/30 text-blue-200"
                                                    : "bg-green-500/20 text-green-300"
                                            }`}
                                        >
                                            {activeStep === "submit"
                                                ? "Pending"
                                                : activeStep === "ticket"
                                                ? "Pending → In Progress"
                                                : activeStep === "action"
                                                ? "In Progress"
                                                : "Resolved"}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-neutral-200 line-clamp-2">
                                        {activeStep === "submit" &&
                                            "Reported: Broken streetlight near Barangay Hall, causing safety concerns at night."}
                                        {activeStep === "ticket" &&
                                            "Ticket created and queued for electrical maintenance team assignment."}
                                        {activeStep === "action" &&
                                            "Team dispatched to inspect and repair the faulty streetlight."}
                                        {activeStep === "insights" &&
                                            "This report contributes to a hotspot cluster for lighting issues in the area."}
                                    </p>
                                </div>

                                {/* Tiny metrics row */}
                                <div className="flex items-center justify-between gap-3 pt-1 text-[10px] text-neutral-300">
                                    <div>
                                        <p className="uppercase tracking-wide opacity-70">
                                            Sample metrics
                                        </p>
                                        <p className="font-mono">
                                            1,248 reports • 3.2 days avg.
                                            resolve
                                        </p>
                                    </div>
                                    <p className="text-right opacity-70">
                                        Heatmaps highlight recurring problem
                                        areas for smarter planning.
                                    </p>
                                </div>
                            </div>

                            <p className="text-[11px] text-neutral-500">
                                iCARE connects everyday residents with decision
                                makers, turning individual complaints into
                                actionable data for the whole community.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Reports */}
            <section className="w-full px-6 md:px-20 lg:px-40 py-16 bg-neutral-950 text-white min-h-[500px]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl md:text-4xl font-semibold">
                            Latest Reports
                        </h2>
                        <Link
                            href={route("reports")}
                            className="text-sm md:text-base text-yellow-400 hover:text-yellow-300 transition"
                        >
                            View All →
                        </Link>
                    </div>
                    <div className="relative">
                        {reports.length > 2 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition"
                                    aria-label="Previous"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 19.5L8.25 12l7.5-7.5"
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition"
                                    aria-label="Next"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                        />
                                    </svg>
                                </button>
                            </>
                        )}
                        <div className="flex gap-6 overflow-hidden pb-4 min-h-[350px]">
                            {reports.length > 0 ? (
                                reports
                                    .slice(currentIndex, currentIndex + 2)
                                    .map((report) => {
                                        const images = Array.isArray(
                                            report.images
                                        )
                                            ? report.images
                                            : [];
                                        const date = report.created_at
                                            ? new Date(
                                                  report.created_at
                                              ).toLocaleDateString()
                                            : "";
                                        // First sentence + ellipsis logic
                                        const rawDesc =
                                            report.description ||
                                            "No description provided.";
                                        let firstSentence = rawDesc;
                                        if (
                                            rawDesc !==
                                            "No description provided."
                                        ) {
                                            const match =
                                                rawDesc.match(/^[^.!?]*[.!?]/); // up to first terminator
                                            if (match)
                                                firstSentence = match[0].trim();
                                            // Remove trailing punctuation for cleaner ellipsis
                                            firstSentence =
                                                firstSentence.replace(
                                                    /[.!?]+$/,
                                                    ""
                                                );
                                            if (
                                                rawDesc.length >
                                                firstSentence.length
                                            ) {
                                                firstSentence += "...";
                                            }
                                        }
                                        return (
                                            <div
                                                key={report.id}
                                                onClick={() =>
                                                    openModal(report)
                                                }
                                                className="min-w-[280px] md:min-w-[340px] bg-neutral-900/95 text-gray-100 rounded-xl border border-white/10 shadow-xl p-6 snap-start hover:border-yellow-400 transition cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-sm font-semibold">
                                                            {(
                                                                report.user
                                                                    ?.name ||
                                                                "Guest"
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-sm">
                                                                {report.user
                                                                    ?.name ||
                                                                    "Guest"}
                                                            </span>
                                                            <span className="text-gray-400 text-xs">
                                                                {
                                                                    report.category
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-400 font-mono">
                                                        {date}
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                                                    {report.subject}
                                                </h3>
                                                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                                                    {firstSentence}
                                                </p>
                                                {images.length > 0 && (
                                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                                        {images
                                                            .slice(0, 3)
                                                            .map((img, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={`/storage/${img}`}
                                                                    className="w-full h-20 object-cover rounded-lg border border-white/10"
                                                                />
                                                            ))}
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-start mt-3">
                                                    <span className="text-xs text-gray-400">
                                                        Ticket ID:{" "}
                                                        <span className="font-mono">
                                                            {report.ticket_id}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                            ) : (
                                <div className="flex items-center justify-center w-full text-gray-400 text-lg">
                                    <p>
                                        No reports available at the moment.
                                        Check back soon!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Report Detail Modal */}
            {showModal && selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 w-full max-w-3xl mx-auto rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                        <div className="flex justify-between items-center px-6 py-4 bg-black text-white border-b border-white/10">
                            <h3 className="text-xl font-semibold">
                                Report #{selectedReport.ticket_id}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-white hover:text-yellow-400 text-2xl transition"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="px-6 py-6 space-y-5 max-h-[70vh] overflow-y-auto text-gray-100">
                            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-lg font-semibold">
                                    {(selectedReport.user?.name || "Guest")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">
                                        {selectedReport.user?.name || "Guest"}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {selectedReport.category}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">
                                    Subject:
                                </p>
                                <p className="text-lg font-semibold">
                                    {selectedReport.subject || "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">
                                    Description:
                                </p>
                                <p className="text-base leading-relaxed whitespace-pre-wrap">
                                    {selectedReport.description || "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">
                                    Location / Street:
                                </p>
                                <p className="text-base">
                                    {selectedReport.street || "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">
                                    Date Submitted:
                                </p>
                                <p className="text-base">
                                    {selectedReport.submitted_at
                                        ? new Date(
                                              selectedReport.submitted_at
                                          ).toLocaleString()
                                        : selectedReport.created_at
                                        ? new Date(
                                              selectedReport.created_at
                                          ).toLocaleString()
                                        : "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-2">
                                    Status:
                                </p>
                                <span
                                    className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                                        selectedReport.status === "Pending"
                                            ? "bg-yellow-500/20 text-yellow-300"
                                            : selectedReport.status ===
                                              "In Progress"
                                            ? "bg-blue-500/20 text-blue-300"
                                            : selectedReport.status ===
                                              "Resolved"
                                            ? "bg-green-500/20 text-green-300"
                                            : "bg-gray-500/20 text-gray-300"
                                    }`}
                                >
                                    {selectedReport.status || "Pending"}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-3">
                                    Images:
                                </p>
                                {selectedReport.images &&
                                selectedReport.images.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        {selectedReport.images.map(
                                            (img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={`/storage/${img}`}
                                                    alt={`Report image ${
                                                        idx + 1
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedImage(
                                                            `/storage/${img}`
                                                        )
                                                    }
                                                    className="w-full h-28 object-cover rounded-lg border border-white/20 cursor-pointer hover:opacity-75 transition"
                                                />
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">
                                        No images attached
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                <Link
                                    href={route("reports")}
                                    className="text-sm text-yellow-400 hover:text-yellow-300 transition"
                                >
                                    View All Reports →
                                </Link>
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Viewer Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-6xl max-h-[90vh]">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white hover:text-yellow-400 text-3xl font-bold transition"
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

            {/* Explore iCARE */}
            <section className="w-full py-16 px-6 md:px-20 lg:px-40 bg-white text-black space-y-12">
                <h2 className="text-3xl md:text-4xl font-semibold">
                    Explore iCARE
                </h2>
                <Link href={route("about")}>
                    <div className="group relative w-full text-white h-56 md:h-72 rounded-2xl overflow-hidden cursor-pointer mt-6 md:mt-10">
                        <img
                            src="/images/2.png"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition" />
                        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-8">
                            <h3 className="text-2xl md:text-3xl font-bold">
                                About iCARE
                            </h3>
                            <p className="max-w-lg text-sm md:text-base opacity-90">
                                Learn the mission and purpose behind the iCARE
                                initiative.
                            </p>
                        </div>
                    </div>
                </Link>
            </section>

            {/* Floating Cat */}
            <img
                src="/images/logo_cat3.png"
                alt="Floating Cat"
                className="floating-cat w-40 md:w-48 lg:w-60 z-50 pointer-events-none"
            />
            <style>{`
                .floating-cat { position: fixed; bottom: 20px; right: 20px; animation: float 4s ease-in-out infinite; }
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }
            `}</style>
            <Footer />
        </>
    );
}
