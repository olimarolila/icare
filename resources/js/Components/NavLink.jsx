import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
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
}
