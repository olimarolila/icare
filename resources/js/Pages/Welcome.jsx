import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome({ auth }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <div
                className="relative min-h-screen bg-cover bg-center text-white"
                style={{ backgroundImage: "url('/images/bg (homepage).jpg')" }}
            >

                {/* Navbar */}
                <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-3 backdrop-blur-md bg-black/30 border-b border-[#7D7D7D]">
                    {/* Left side - logo */}
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
                            <Link href={route('reports')} className="hover:text-yellow-400 transition-colors">Reports</Link>
                        </li>
                        <li>
                            <Link href={route('report.form')} className="hover:text-yellow-400 transition-colors">Report Form</Link>
                        </li>
                        <li>
                            <Link href={route('about')} className="hover:text-yellow-400 transition-colors">About</Link>
                        </li>
                    </ul>

                    {/* Desktop Auth Links */}
                    <div className="hidden md:flex items-center space-x-8 font-semibold text-[1.2rem]">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="hover:text-yellow-400 transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="hover:text-yellow-400 transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href={route('register')}
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
                            ? 'opacity-100 translate-y-0 max-h-96'
                            : 'opacity-0 -translate-y-5 max-h-0 overflow-hidden'
                    }`}
                >
                    <Link
                        href={route('reports')}
                        className="block py-1 hover:text-yellow-400 transition-colors"
                    >
                        Reports
                    </Link>
                    <Link
                        href={route('report.form')}
                        className="block py-1 hover:text-yellow-400 transition-colors"
                    >
                        Report Form
                    </Link>
                    <Link
                        href={route('about')}
                        className="block py-1 hover:text-yellow-400 transition-colors"
                    >
                        About
                    </Link>

                    <div className="border-t border-gray-600 my-2"></div>

                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="block py-1 hover:text-yellow-400 transition-colors"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="block py-1 hover:text-yellow-400 transition-colors"
                            >
                                Log In
                            </Link>
                            <Link
                                href={route('register')}
                                className="block py-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Main content */}
                <main className="relative z-10 flex flex-col items-start justify-center min-h-[80vh] px-8 md:px-32 lg:px-40">
                    {/* Center logo */}
                    <img
                        src="/images/logo_text.png"
                        alt="iCARE"
                        className="h-28 md:h-40 lg:h-52 object-contain mb-6 drop-shadow-lg"
                    />

                    {/* Tagline */}
                    <p className="text-lg md:text-2xl lg:text-4xl leading-snug max-w-xl">
                        “Because Caring for the Community Starts with You.”
                    </p>
                </main>

                {/* Bottom-right cat logo */}
                <img
                    src="/images/logo_cat.png"
                    alt="iCARE Cat Mascot"
                    className="absolute bottom-3 right-3 w-44 md:w-64 lg:w-80 object-contain z-10"
                />
            </div>
        </>
    );
}