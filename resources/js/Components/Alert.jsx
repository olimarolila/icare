// resources/js/Components/Alert.jsx
import React, { useEffect } from "react";

const palettes = {
    info: {
        text: "text-blue-800",
        bg: "bg-blue-50",
        border: "border-blue-300",
        btnBg: "bg-blue-50",
        btnText: "text-blue-500",
        btnRing: "focus:ring-blue-400",
        hover: "hover:bg-blue-200",
    },
    danger: {
        text: "text-red-800",
        bg: "bg-red-50",
        border: "border-red-300",
        btnBg: "bg-red-50",
        btnText: "text-red-500",
        btnRing: "focus:ring-red-400",
        hover: "hover:bg-red-200",
    },
    success: {
        text: "text-green-800",
        bg: "bg-green-50",
        border: "border-green-300",
        btnBg: "bg-green-50",
        btnText: "text-green-500",
        btnRing: "focus:ring-green-400",
        hover: "hover:bg-green-200",
    },
    warning: {
        text: "text-yellow-800",
        bg: "bg-yellow-50",
        border: "border-yellow-300",
        btnBg: "bg-yellow-50",
        btnText: "text-yellow-500",
        btnRing: "focus:ring-yellow-400",
        hover: "hover:bg-yellow-200",
    },
    gray: {
        text: "text-gray-800",
        bg: "bg-gray-50",
        border: "border-gray-300",
        btnBg: "bg-gray-50",
        btnText: "text-gray-500",
        btnRing: "focus:ring-gray-400",
        hover: "hover:bg-gray-200",
    },
};

const posMap = {
    "top-right": "fixed top-4 right-4",
    "top-center": "fixed top-4 left-1/2 -translate-x-1/2",
    "bottom-right": "fixed bottom-4 right-4",
};

export default function Alert({
    variant = "info",
    children,
    onClose,
    id,
    className = "",
    role = "alert",
    autoDismissMs, // e.g. 4000
    floating = false, // ⬅️ NEW: make it a toast
    position = "top-right", // ⬅️ NEW: where to float
}) {
    const p = palettes[variant] || palettes.info;

    useEffect(() => {
        if (!autoDismissMs || !onClose) return;
        const t = setTimeout(onClose, autoDismissMs);
        return () => clearTimeout(t);
    }, [autoDismissMs, onClose]);

    const wrapperClass = floating
        ? `${
              posMap[position] || posMap["top-right"]
          } z-[9999] w-[min(420px,calc(100%-1rem))]`
        : "";

    return (
        <div className={wrapperClass}>
            <div
                id={id}
                role={role}
                className={`flex items-center p-4 mb-4 border-t-4 rounded-md shadow ${p.text} ${p.bg} ${p.border} ${className}`}
            >
                <svg
                    className="shrink-0 w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>

                <div className="ms-3 text-sm font-medium">{children}</div>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className={`ms-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 ${p.btnBg} ${p.btnText} ${p.btnRing} ${p.hover}`}
                        aria-label="Close"
                    >
                        <span className="sr-only">Dismiss</span>
                        <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
