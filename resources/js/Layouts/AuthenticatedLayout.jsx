import { Transition } from "@headlessui/react";
import { Link, usePage, router } from "@inertiajs/react";
import { createContext, useContext, useState } from "react";
import ConfirmDialog from "@/Components/ConfirmDialog";

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

Dropdown.Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </>
    );
};

Dropdown.Content = ({
    align = "right",
    width = "48",
    contentClasses = "py-1 bg-white",
    children,
}) => {
    const { open, setOpen } = useContext(DropDownContext);

    let alignmentClasses = "origin-top";

    if (align === "left") {
        alignmentClasses = "ltr:origin-top-left rtl:origin-top-right start-0";
    } else if (align === "right") {
        alignmentClasses = "ltr:origin-top-right rtl:origin-top-left end-0";
    }

    let widthClasses = "";

    if (width === "48") {
        widthClasses = "w-48";
    }

    return (
        <>
            <Transition
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                    onClick={() => setOpen(false)}
                >
                    <div
                        className={
                            `rounded-md ring-1 ring-black ring-opacity-5 ` +
                            contentClasses
                        }
                    >
                        {children}
                    </div>
                </div>
            </Transition>
        </>
    );
};

Dropdown.Link = ({ className = "", children, ...props }) => (
    <Link
        {...props}
        className={
            "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none " +
            className
        }
    >
        {children}
    </Link>
);

const NavLink = ({ active = false, className = "", children, ...props }) => (
    <Link
        {...props}
        className={
            "inline-flex h-full items-center border-b-2 px-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
            (active
                ? "border-yellow-400 text-yellow-400 focus:border-yellow-500"
                : "border-transparent text-white/80 hover:border-yellow-300 hover:text-yellow-400 focus:border-yellow-300 focus:text-yellow-400") +
            " " +
            className
        }
    >
        {children}
    </Link>
);

const ResponsiveNavLink = ({
    active = false,
    className = "",
    children,
    ...props
}) => (
    <Link
        {...props}
        className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
            active
                ? "border-yellow-400 bg-black/60 text-yellow-400 focus:border-yellow-500 focus:bg-black/70"
                : "border-transparent text-white/80 hover:border-yellow-300 hover:bg-black/60 hover:text-yellow-400 focus:border-yellow-300 focus:bg-black/60 focus:text-yellow-400"
        } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
    >
        {children}
    </Link>
);

export default function AuthenticatedLayout({ header, children }) {
    const auth = usePage().props.auth;
    const user = auth?.user;
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const isAdmin = user?.role === "admin";
    const dashboardRouteName = "admin.dashboard";
    const dashboardIsActive = isAdmin
        ? route().current(dashboardRouteName)
        : false;
    const profileIsActive = route().current("profile.edit");

    return (
        <div className="min-h-screen bg-black-100">
            <nav className="sticky top-0 z-20 border-b border-[#7D7D7D] backdrop-blur-md bg-black">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <img
                                        src="/images/icare.png"
                                        alt="iCARE Logo"
                                        className="h-10 md:h-10 object-contain cursor-pointer"
                                    />
                                </Link>
                            </div>

                            {isAdmin && (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route(dashboardRouteName)}
                                        active={dashboardIsActive}
                                        className="text-white hover:text-yellow-400"
                                    >
                                        Dashboard
                                    </NavLink>
                                    <NavLink
                                        href={route("admin.reports")}
                                        active={route().current(
                                            "admin.reports"
                                        )}
                                        className="text-white hover:text-yellow-400"
                                    >
                                        Reports
                                    </NavLink>
                                    <NavLink
                                        href={route("admin.users")}
                                        active={route().current("admin.users")}
                                        className="text-white hover:text-yellow-400"
                                    >
                                        Users
                                    </NavLink>
                                    <NavLink
                                        href={route("admin.archives")}
                                        active={route().current(
                                            "admin.archives"
                                        )}
                                        className="text-white hover:text-yellow-400"
                                    >
                                        Archives
                                    </NavLink>
                                    {profileIsActive && (
                                        <NavLink
                                            href={route("profile.edit")}
                                            active
                                            className="text-white hover:text-yellow-400"
                                        >
                                            Profile
                                        </NavLink>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-transparent px-3 py-2 text-sm font-medium leading-4 text-white/80 transition duration-150 ease-in-out hover:text-yellow-400 focus:outline-none"
                                            >
                                                {user?.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content className="bg-black/70 text-white border border-[#7D7D7D]">
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                            className="hover:text-yellow-400"
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowLogoutConfirm(true)
                                            }
                                            className="block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out hover:text-yellow-400 focus:text-yellow-400 focus:outline-none"
                                        >
                                            Log Out
                                        </button>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-white transition duration-150 ease-in-out hover:bg-black/40 hover:text-yellow-400 focus:bg-black/40 focus:text-yellow-400 focus:outline-none"
                                aria-label="Toggle menu"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !menuOpen ? "inline-flex" : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            menuOpen ? "inline-flex" : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (menuOpen ? "block" : "hidden") +
                        " sm:hidden bg-black/80 backdrop-blur-md border-b border-[#7D7D7D]"
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        {isAdmin && (
                            <>
                                <ResponsiveNavLink
                                    href={route(dashboardRouteName)}
                                    active={dashboardIsActive}
                                    className="text-white hover:text-yellow-400"
                                >
                                    Dashboard
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("admin.reports")}
                                    active={route().current("admin.reports")}
                                    className="text-white hover:text-yellow-400"
                                >
                                    Reports
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("admin.users")}
                                    active={route().current("admin.users")}
                                    className="text-white hover:text-yellow-400"
                                >
                                    Users
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("admin.archives")}
                                    active={route().current("admin.archives")}
                                    className="text-white hover:text-yellow-400"
                                >
                                    Archives
                                </ResponsiveNavLink>
                                {profileIsActive && (
                                    <ResponsiveNavLink
                                        href={route("profile.edit")}
                                        active
                                        className="text-white hover:text-yellow-400"
                                    >
                                        Profile
                                    </ResponsiveNavLink>
                                )}
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-600 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-white/90">
                                {user?.name}
                            </div>
                            <div className="text-sm font-medium text-white/70">
                                {user?.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("profile.edit")}
                                active={profileIsActive}
                                className="text-white hover:text-yellow-400"
                            >
                                Profile
                            </ResponsiveNavLink>
                            <button
                                type="button"
                                onClick={() => setShowLogoutConfirm(true)}
                                className="block w-full border-l-4 border-transparent py-2 pe-4 ps-3 text-start text-base font-medium text-white transition duration-150 ease-in-out hover:border-yellow-300 hover:text-yellow-400 focus:border-yellow-300 focus:text-yellow-400 focus:outline-none"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>

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
        </div>
    );
}
