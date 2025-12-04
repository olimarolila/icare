import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import ConfirmDialog from "@/Components/ConfirmDialog";

export default function Navbar({ auth }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // adjust this according to your actual user field
    const isAdmin = auth?.user && auth.user.role === "admin";

    return (
        <>
            <nav className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-10 py-3 backdrop-blur-md bg-black/30 border-b border-[#7D7D7D]">
                <div className="flex items-center space-x-4">
                    <Link href="/">
                        <img
                            src="/images/logo_text.png"
                            alt="iCARE Logo"
                            className="h-10 md:h-10 object-contain cursor-pointer"
                        />
                    </Link>
                </div>

                {/* Center menu */}
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

                {/* Right side (desktop) */}
                <div className="hidden md:flex items-center space-x-8 font-semibold text-[1.2rem]">
                    {auth?.user ? (
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen((s) => !s)}
                                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
                                aria-haspopup="true"
                                aria-expanded={userMenuOpen}
                            >
                                <span className="text-sm">
                                    {auth.user.name}
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    className="w-4 h-4 text-white/70"
                                    fill="currentColor"
                                >
                                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.353a.75.75 0 111.14.98l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" />
                                </svg>
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-black/90 border border-white/10 rounded-md shadow-lg">
                                    <div className="py-1">
                                        {isAdmin && (
                                            <Link
                                                href={route("dashboard")}
                                                className="block px-4 py-2 text-sm hover:bg-white/5"
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            href={route("profile.edit")}
                                            className="block px-4 py-2 text-sm hover:bg-white/5"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowLogoutConfirm(true)
                                            }
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-red-600 hover:text-white"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-white hover:text-yellow-400 transition-colors"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
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

            {/* Mobile dropdown */}
            <div
                className={`fixed top-[65px] left-0 w-full bg-black/80 backdrop-blur-md border-b border-[#7D7D7D] z-30 px-6 py-4 text-center font-medium text-[1rem] transition-all duration-500 ease-in-out transform ${
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
                <div className="border-t border-gray-600 my-2" />
                {auth?.user ? (
                    <>
                        {isAdmin && (
                            <Link
                                href={route("dashboard")}
                                className="block py-1 hover:text-yellow-400 transition-colors"
                            >
                                Dashboard
                            </Link>
                        )}

                        <Link
                            href={route("profile.edit")}
                            className="block py-1 hover:text-yellow-400 transition-colors"
                        >
                            Profile
                        </Link>

                        <button
                            type="button"
                            onClick={() => setShowLogoutConfirm(true)}
                            className="block py-1 hover:text-red-400 transition-colors"
                        >
                            Logout
                        </button>
                    </>
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

            <ConfirmDialog
                open={showLogoutConfirm}
                onConfirm={() => {
                    router.post(route("logout"));
                    setShowLogoutConfirm(false);
                }}
                onCancel={() => setShowLogoutConfirm(false)}
                title="Confirm Logout"
                message="Are you sure you want to log out?"
                confirmText="Logout"
                cancelText="Cancel"
                variant="danger"
            />
        </>
    );
}
