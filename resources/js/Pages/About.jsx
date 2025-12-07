import { Link } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import FlashMessages from "@/Components/FlashMessages";
import Footer from "@/Components/Footer";

const values = [
    {
        title: "Transparency",
        description:
            "Ticket timelines, audit logs, and public voting keep barangay work visible to everyone.",
        accent: "bg-amber-500/20 border-amber-300/40",
    },
    {
        title: "Community-first",
        description:
            "Residents shape the backlog by submitting concerns and upvoting what matters most.",
        accent: "bg-green-500/20 border-green-300/40",
    },
    {
        title: "Data-backed decisions",
        description:
            "Heatmaps, response times, and aging tickets guide LGUs on where to deploy crews next.",
        accent: "bg-blue-500/20 border-blue-300/40",
    },
];

const processSteps = [
    {
        label: "Submit a report",
        badge: "Residents",
        description: "Citizens upload photos, drop a pin, and describe the issue in minutes.",
        state: "completed",
        statusLabel: "Completed",
    },
    {
        label: "Ticket is created",
        badge: "System",
        description:"Each submission becomes a unique ticket with a status history.",
        state: "current",
        statusLabel: "In Progress",
    },
    {
        label: "Authorities take action",
        badge: "LGU / Agencies",
        description: "Coordinators assign tickets and update statuses as repairs progress.",
        state: "pending",
        statusLabel: "Pending",
    },
    {
        label: "Insights & accountability",
        badge: "Admin Dashboard",
        description: "Resolved tickets include proof-of-work and timestamps.",
        state: "pending",
        statusLabel: "Resolved",
    },
];

const testimonials = [
    {
        quote:
            "With iCARE, our barangay finally tracks every streetlight ticket—no concern slips through the cracks.",
        name: "Brgy. Operations Head",
    },
    {
        quote:
            "I reported flooding on my phone and watched the status move to Resolved in three days.",
        name: "Community Volunteer",
    },
];

const sdgs = [
    {
        number: "11",
        title: "Sustainable Cities & Communities",
        focus: "Build resilient neighborhoods with responsive public services.",
        description:
            "Citizen reports expose unsafe roads, broken lights, and flooding so LGUs can prioritize resilient infrastructure investments.",
        image: "/images/sdg (11).jpg",
        gradient: "from-amber-500/30 via-orange-500/20 to-transparent",
        ring: "border-amber-200/60",
    },
    {
        number: "16",
        title: "Peace, Justice & Strong Institutions",
        focus: "Strengthen accountability and citizen trust in governance.",
        description:
            "Transparent timelines, audit logs, and analytics reinforce accountability and nurture trust between citizens and agencies.",
        image: "/images/sdg (16).jpg",
        gradient: "from-sky-500/30 via-blue-500/20 to-transparent",
        ring: "border-sky-200/60",
    },
];

const developers = [
    {
        name: "Candido",
        role: "Research & Quality Lead",
        image: "/images/person_candido.jpg",
        tags: ["Research", "QA", "Community"],
    },
    {
        name: "Olila",
        role: "Full-Stack Engineer",
        image: "/images/person_olila.jpg",
        tags: ["Laravel", "React", "Product"],
    },
    {
        name: "Pena",
        role: "Experience Designer",
        image: "/images/person_pena.jpg",
        tags: ["Design", "Brand", "Motion"],
    },
    {
        name: "Xavier",
        role: "Systems & Ops Specialist",
        image: "/images/person_xavier.jpg",
        tags: ["DevOps", "Security", "Docs"],
    },
];

export default function About({ auth }) {
    const getStepVisual = (state = "pending") => {
        if (state === "completed") {
            return {
                circleClass:
                    "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40",
                connectorClass: "bg-gradient-to-r from-emerald-400 to-emerald-200",
                statusClass: "text-emerald-300",
                badgeClass: "text-emerald-300",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        className="w-5 h-5"
                        fill="currentColor"
                    >
                        <path d="M16.707 5.293a1 1 0 0 0-1.414 0L8 12.586 4.707 9.293a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414z" />
                    </svg>
                ),
            };
        }
        if (state === "current") {
            return {
                circleClass:
                    "bg-neutral-900 text-sky-400 border-2 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.35)]",
                connectorClass: "bg-gradient-to-r from-sky-400 to-sky-200",
                statusClass: "text-sky-300",
                badgeClass: "text-sky-400",
                icon: (
                    <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-sky-700/60">
                        <span className="w-3 h-3 rounded-full bg-sky-400" />
                    </span>
                ),
            };
        }
        return {
            circleClass: "bg-white/10 text-white/60 border border-white/20",
            connectorClass: "bg-white/10",
            statusClass: "text-white/60",
            badgeClass: "text-white/50",
            icon: <span className="w-2 h-2 rounded-full bg-white/50" />,
        };
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-fixed text-white"
            style={{ backgroundImage: "url('/images/bg (reports).jpg')" }}
        >
            <FlashMessages />
            <Navbar auth={auth} />

            <main className="relative z-10 min-h-[80vh] px-6 md:px-12 lg:px-20 xl:px-24 py-12">
                <div className="bg-neutral-900/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl px-6 md:px-10 lg:px-12 py-10 space-y-14">
                    {/* Platform Description */}
                    <section className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                            ABOUT <span className="text-red-400">iCARE</span>
                        </h1>
                        <div className="h-1 w-32 bg-white/70" />
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed tracking-wide text-justify text-white/90">
                            Integrated Community Assistance & Reporting Environment, short for iCARE, is a civic reporting platform where citizens can submit infrastructure concerns with supporting photos, locations, and descriptions. Each report is tracked through the statuses <span className="font-semibold">Pending</span>, <span className="font-semibold">In Progress</span>, and <span className="font-semibold">Resolved</span>, empowering barangay officials to prioritize fixes while keeping the community informed through transparent ticket timelines and analytics.
                        </p>
                    </section>

                    {/* Mission & Values */}
                    <section className="grid gap-8 lg:grid-cols-[1.1fr_minmax(0,1fr)] items-start lg:items-center">
                        <div className="space-y-5">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/60">Mission</p>
                            <h2 className="text-2xl md:text-3xl font-semibold">Why we built iCARE</h2>
                            <p className="text-sm md:text-base lg:text-lg text-white/90 leading-relaxed text-justify">
                                We believe every sidewalk crack, broken light, or drainage issue deserves a response that residents can track. iCARE streamlines the feedback loop between citizens and LGUs so that data, not guesswork, guides community investments.
                            </p>
                            <ul className="space-y-2 text-sm text-white/80 leading-relaxed list-disc pl-5">
                                <li>Turn everyday complaints into actionable tickets with unique IDs.</li>
                                <li>Keep barangay offices accountable with public timelines and audit logs.</li>
                                <li>Empower data-driven planning through response metrics and heatmaps.</li>
                            </ul>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {values.map((value) => (
                                <div
                                    key={value.title}
                                    className={`border rounded-2xl p-4 text-sm text-white/90 shadow-lg ${value.accent}`}
                                >
                                    <p className="text-xs uppercase tracking-[0.25em] text-white/80">
                                        Value
                                    </p>
                                    <h3 className="text-lg font-semibold mt-1 mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-white/80 leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Developers */}
                    <section className="relative space-y-6">
                        <div
                            className="absolute inset-0 -mx-6 rounded-3xl bg-gradient-to-r from-red-500/10 via-transparent to-amber-500/10 blur-3xl opacity-60 pointer-events-none"
                            aria-hidden="true"
                        />
                        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Team</p>
                                <h2 className="text-2xl md:text-3xl font-bold">Meet the Developers</h2>
                                <p className="text-sm text-white/70 mt-2 max-w-2xl">
                                    A student crew blending research, design, and engineering to keep iCARE reliable for every barangay.
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.4em] text-white/50">
                                <span className="h-px w-10 bg-white/30" />
                                <span>Core team</span>
                                <span className="h-px w-10 bg-white/30" />
                            </div>
                        </div>
                        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {developers.map((dev) => (
                                <div
                                    key={dev.name}
                                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 lg:p-6 shadow-2xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.4)]"
                                >
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-red-500/20 via-amber-500/10 to-transparent blur-2xl transition duration-300"
                                        aria-hidden="true"
                                    />
                                    <div className="relative flex flex-col items-center text-center gap-4">
                                        <div className="relative">
                                            <div
                                                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/50 via-amber-500/20 to-transparent blur-2xl opacity-70"
                                                aria-hidden="true"
                                            />
                                            <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-2xl border border-white/20 bg-white/10 overflow-hidden">
                                                <img
                                                    src={dev.image}
                                                    alt={dev.name}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-white/50">Core Team</p>
                                            <p className="text-lg font-semibold tracking-wide">{dev.name}</p>
                                            <p className="text-sm text-white/70">{dev.role}</p>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {dev.tags.map((tag) => (
                                                <span
                                                    key={`${dev.name}-${tag}`}
                                                    className="px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[0.65rem] uppercase tracking-[0.35em] text-white/70"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SDG Section */}
                    <section className="relative space-y-8">
                        <div
                            className="absolute inset-0 -mx-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-transparent to-sky-500/10 blur-3xl opacity-70 pointer-events-none"
                            aria-hidden="true"
                        />
                        <div className="relative space-y-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Impact</p>
                            <h2 className="text-2xl md:text-3xl font-bold">Sustainable Development Goals</h2>
                        </div>
                        <div className="relative flex flex-col xl:flex-row gap-8 xl:gap-12">
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-4">
                                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/70">
                                    <span className="h-1 w-10 rounded-full bg-gradient-to-r from-amber-400 to-sky-400" />
                                    <span>Citywide outcomes</span>
                                </div>
                                <p className="text-sm md:text-base lg:text-lg text-white/90 leading-relaxed">
                                    The iCARE platform powers SDG 11 by offering a responsive digital channel for unsafe roads, broken streetlights, and flooding incidents so LGUs can prioritize resilient infrastructure. It pushes SDG 16 forward by reinforcing transparency through real-time ticket statuses, audit logs of government actions, and analytics that keep agencies accountable.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                                    {sdgs.map((goal) => (
                                        <div
                                            key={`highlight-${goal.number}`}
                                            className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-semibold tracking-[0.2em]">
                                                {goal.number}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-white">{goal.title}</p>
                                                <p className="text-xs text-white/70 leading-relaxed">{goal.focus}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {sdgs.map((goal) => (
                                    <div
                                        key={goal.number}
                                        className={`relative overflow-hidden rounded-3xl border ${goal.ring} bg-gradient-to-br ${goal.gradient} p-5 lg:p-6 shadow-xl space-y-4 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl`}
                                    >
                                        <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-white/80">
                                            <span>Goal {goal.number}</span>
                                            <span className="px-2 py-1 border border-white/40 rounded-full">UN SDG</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">{goal.title}</h3>
                                        <p className="text-sm text-white/80 leading-relaxed">{goal.description}</p>
                                        <div className="relative w-full aspect-square rounded-2xl border border-white/20 bg-black/20 overflow-hidden">
                                            <img
                                                src={goal.image}
                                                alt={`SDG ${goal.number}`}
                                                className="object-contain w-full h-full transition duration-500 ease-out hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Process timeline */}
                    <section className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/60">How it works</p>
                            <h2 className="text-2xl md:text-3xl font-bold">From report to resolution</h2>
                        </div>
                        <div className="relative">
                            <div
                                className="absolute inset-0 -mx-6 rounded-[2.75rem] bg-gradient-to-r from-amber-500/15 via-white/10 to-sky-500/15 blur-3xl opacity-60 pointer-events-none"
                                aria-hidden="true"
                            />
                            <div className="relative bg-neutral-900/95 text-white rounded-[2.75rem] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.65)] p-6 md:p-10 overflow-hidden">
                                <div
                                    className="absolute inset-x-10 top-4 h-px bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 opacity-40"
                                    aria-hidden="true"
                                />
                                <div className="overflow-x-auto pb-2">
                                    <div className="flex gap-8 min-w-[720px]">
                                        {processSteps.map((step, index) => {
                                            const visuals = getStepVisual(step.state);
                                            const isLast = index === processSteps.length - 1;
                                            return (
                                                <div key={step.label} className="flex-1 flex flex-col gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className={`w-12 h-12 rounded-full flex items-center justify-center ${visuals.circleClass}`}
                                                        >
                                                            {visuals.icon}
                                                        </div>
                                                        {!isLast && (
                                                            <div
                                                                className={`hidden md:block h-1 flex-1 rounded-full ${visuals.connectorClass}`}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p
                                                            className={`text-[0.55rem] uppercase tracking-[0.45em] ${visuals.badgeClass}`}
                                                        >
                                                            {step.badge}
                                                        </p>
                                                        <p className="text-lg font-semibold text-white">{step.label}</p>
                                                        <p className={`text-xs font-semibold ${visuals.statusClass}`}>
                                                            {step.statusLabel}
                                                        </p>
                                                        <p className="text-sm text-white/70 leading-relaxed">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                    {!isLast && (
                                                        <div className="md:hidden h-px w-full bg-slate-200 opacity-60" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials */}
                    <section className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Voices</p>
                            <h2 className="text-2xl md:text-3xl font-bold">What people are saying</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {testimonials.map((t, idx) => (
                                <div
                                    key={`${t.name}-${idx}`}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg"
                                >
                                    <p className="text-base italic text-white/90 leading-relaxed">
                                        “{t.quote}”
                                    </p>
                                    <p className="mt-4 text-sm uppercase tracking-[0.2em] text-white/70">
                                        {t.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Calls to action */}
                    <section className="grid gap-4 md:grid-cols-2">
                        <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-6 flex flex-col gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Residents</p>
                                <h3 className="text-2xl font-semibold">Start submitting reports</h3>
                                <p className="text-sm text-white/80 leading-relaxed mt-2">
                                    Spot an issue in your neighborhood? Share details, photos, and a pin so officials can act quickly.
                                </p>
                            </div>
                            <Link
                                href={route("reports")}
                                className="inline-flex items-center justify-center rounded-xl bg-white text-black font-semibold px-4 py-2 hover:bg-white/80 transition"
                            >
                                Go to Reports
                            </Link>
                        </div>
                        <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-2xl p-6 flex flex-col gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Local leaders</p>
                                <h3 className="text-2xl font-semibold">Bring iCARE to your barangay</h3>
                                <p className="text-sm text-white/80 leading-relaxed mt-2">
                                    Need a walkthrough or want to onboard more agencies? Let us know and we'll set up an orientation.
                                </p>
                            </div>
                            <Link
                                href={route("register")}
                                className="inline-flex items-center justify-center rounded-xl border border-white/70 text-white font-semibold px-4 py-2 hover:bg-white/10 transition"
                            >
                                Request Access
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            <img
                src="/images/logo_cat3.png"
                alt="Floating Cat"
                className="floating-cat w-32 md:w-48 lg:w-60 z-50 pointer-events-none"
            />
            <style>{`
                .floating-cat { position: fixed; bottom: 20px; right: 20px; animation: float 4s ease-in-out infinite; }
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }
            `}</style>
            <footer className="relative z-10">
                <Footer />
            </footer>
        </div>
    );
}
