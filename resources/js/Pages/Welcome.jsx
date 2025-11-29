import { Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

export default function Welcome({ auth }) {
    const [menuOpen, setMenuOpen] = useState(false);

    // Detect when element is visible on screen
    // Detect when element is visible on screen
    const useInView = (options) => {
        const [isInView, setIsInView] = useState(false);
        const ref = useRef(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect(); // animate only once
                    }
                },
                { threshold: 0.3, ...options }
            );

            if (ref.current) observer.observe(ref.current);

            return () => observer.disconnect();
        }, [ref]);

        return [ref, isInView];
    };

    // Counter animation helper
    const useCountUp = (end, startAnim) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            if (!startAnim) return;

            let start = 0;
            const duration = 1500;
            const increment = end / (duration / 16.67);

            const animate = () => {
                start += increment;
                if (start < end) {
                    setCount(Math.floor(start));
                    requestAnimationFrame(animate);
                } else {
                    setCount(end);
                }
            };

            requestAnimationFrame(animate);
        }, [startAnim, end]);

        return count;
    };

    // Visibility hook
    const [counterRef, isInView] = useInView();

    // Animated values
    const resolved = useCountUp(123, isInView);
    const pending = useCountUp(56, isInView);
    const progress = useCountUp(34, isInView);

    return (
        <>
            {/* HERO SECTION WITH BACKGROUND IMAGE */}
            <div
                className="relative min-h-screen bg-cover bg-center text-white"
                style={{ backgroundImage: "url('/images/bg (homepage).jpg')" }}
            >
                {/* Navbar */}
                <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-3 backdrop-blur-md bg-black/30 border-b border-[#7D7D7D]">
                    {/* Logo */}
                    <div className="flex items-center space-x-4">
                        <img
                            src="/images/logo_text.png"
                            alt="iCARE Logo"
                            className="h-10 md:h-10 object-contain"
                        />
                    </div>

                    {/* Desktop Links */}
                    <ul className="hidden md:flex items-center space-x-10 font-medium text-[1.2rem]">
                        <li>
                            <Link
                                href={route("reports")}
                                className="hover:text-yellow-400 transition-colors"
                            >
                                Reports
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={route("report.form")}
                                className="hover:text-yellow-400 transition-colors"
                            >
                                Report Form
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={route("about")}
                                className="hover:text-yellow-400 transition-colors"
                            >
                                About
                            </Link>
                        </li>
                    </ul>

                    {/* Auth Links */}
                    <div className="hidden md:flex items-center space-x-8 font-semibold text-[1.2rem]">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="hover:text-yellow-400 transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="hover:text-yellow-400 transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white hover:text-yellow-400 transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-7 h-7"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>
                </nav>

                {/* Mobile Menu Dropdown */}
                <div
                    className={`absolute top-[65px] left-0 w-full bg-black/80 backdrop-blur-md border-b border-[#7D7D7D] z-10 px-6 py-4 text-center font-medium text-[1rem] transition-all duration-500 ease-in-out transform ${
                        menuOpen
                            ? "opacity-100 translate-y-0 max-h-96"
                            : "opacity-0 -translate-y-5 max-h-0 overflow-hidden"
                    }`}
                >
                    <Link
                        href={route("reports")}
                        className="block py-1 hover:text-yellow-400 transition-colors"
                    >
                        Reports
                    </Link>
                    <Link
                        href={route("report.form")}
                        className="block py-1 hover:text-yellow-400 transition-colors"
                    >
                        Report Form
                    </Link>
                    <Link
                        href={route("about")}
                        className="block py-1 hover:text-yellow-400 transition-colors"
                    >
                        About
                    </Link>

                    <div className="border-t border-gray-600 my-2"></div>

                    {auth.user ? (
                        <Link
                            href={route("dashboard")}
                            className="block py-1 hover:text-yellow-400 transition-colors"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route("login")}
                                className="block py-1 hover:text-yellow-400 transition-colors"
                            >
                                Log In
                            </Link>
                            <Link
                                href={route("register")}
                                className="block py-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* HERO CONTENT */}
                <main className="relative z-10 flex flex-col items-start justify-center min-h-[80vh] px-8 md:px-32 lg:px-40">
                    <img
                        src="/images/logo_text.png"
                        alt="iCARE"
                        className="h-28 md:h-40 lg:h-52 object-contain mb-6 drop-shadow-lg"
                    />
                    <p className="text-base md:text-lg lg:text-2xl leading-snug max-w-xl">
                        Because caring for the community starts with you and
                        together, we will make a difference.
                    </p>
                </main>
            </div>

            {/* COUNTER CARDS SECTION (OWN BACKGROUND) */}

            <section className="w-full px-8 md:px-20 lg:px-40 relative z-20">
                <div
                    ref={counterRef}
                    className="bg-black text-white rounded-3xl shadow-2xl p-10 
                -mt-20 md:-mt-24 lg:-mt-28 
                relative z-30
                backdrop-black
                border border-white/10"
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
                            <h3 className="text-xl font-semibold">Pending</h3>
                            <p className="text-5xl font-bold text-yellow-300 mt-3">
                                {pending}
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
                    </div>
                </div>
            </section>

            {/* SHOWCASE SECTION (OWN BACKGROUND) */}
            {/* SHOWCASE SECTION (OWN BACKGROUND) */}
            <section className="w-full py-16 px-6 md:px-20 lg:px-40 bg-white text-black space-y-12">
                <h2 className="text-3xl md:text-4xl font-semibold">
                    Explore iCARE
                </h2>

                {/* Reports Showcase */}
                <Link href={route("reports")}>
                    <div className="group relative text-white w-full h-56 md:h-72 rounded-2xl overflow-hidden cursor-pointer mt-6 md:mt-10">
                        <img
                            src="/images/8.png"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition"></div>

                        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-8">
                            <h3 className="text-2xl md:text-3xl font-bold">
                                Reports Forum
                            </h3>
                            <p className="max-w-lg text-sm md:text-base opacity-90">
                                Browse community-reported concerns and track
                                updates.
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Report Form */}
                <Link href={route("report.form")}>
                    <div className="group relative w-full text-white h-56 md:h-72 rounded-2xl overflow-hidden cursor-pointer mt-6 md:mt-10">
                        <img
                            src="/images/9.png"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition"></div>

                        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-8">
                            <h3 className="text-2xl md:text-3xl font-bold">
                                Submit a Report
                            </h3>
                            <p className="max-w-lg text-sm md:text-base opacity-90">
                                Quickly file concerns and help improve your
                                community.
                            </p>
                        </div>
                    </div>
                </Link>

                {/* About */}
                <Link href={route("about")}>
                    <div className="group relative w-full text-white h-56 md:h-72 rounded-2xl overflow-hidden cursor-pointer mt-6 md:mt-10">
                        <img
                            src="/images/2.png"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition"></div>

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

            {/* FLOATING CAT */}
            <img
                src="/images/logo_cat.png"
                alt="Floating Cat"
                className="floating-cat w-32 md:w-48 lg:w-60 z-50 pointer-events-none"
            />

            <style>
                {`
                .floating-cat {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    animation: float 4s ease-in-out infinite;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                    100% { transform: translateY(0px); }
                }
                `}
            </style>
        </>
    );
}
