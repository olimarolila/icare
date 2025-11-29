import { Link } from "@inertiajs/react";

export default function ResponsiveNavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
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
}
