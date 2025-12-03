import React, { useEffect, useRef } from "react";

export default function ConfirmDialog({
    open,
    onConfirm,
    onCancel,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger", // "danger" | "info" | "success" | "warning" | "gray"
}) {
    const btnRef = useRef(null);

    useEffect(() => {
        if (open) btnRef.current?.focus();
    }, [open]);

    if (!open) return null;

    const v =
        variant === "danger"
            ? {
                  btn: "bg-red-600 hover:bg-red-700 border-red-700",
                  icon: "text-red-600",
              }
            : variant === "success"
            ? {
                  btn: "bg-green-600 hover:bg-green-700 border-green-700",
                  icon: "text-green-600",
              }
            : variant === "warning"
            ? {
                  btn: "bg-yellow-500 hover:bg-yellow-600 border-yellow-600",
                  icon: "text-yellow-600",
              }
            : variant === "gray"
            ? {
                  btn: "bg-gray-700 hover:bg-gray-800 border-gray-800",
                  icon: "text-gray-600",
              }
            : {
                  btn: "bg-blue-600 hover:bg-blue-700 border-blue-700",
                  icon: "text-blue-600",
              };

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-[min(480px,calc(100%-2rem))] max-w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
                    <svg
                        className={`w-6 h-6 ${v.icon}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M10 .5a9.5 9.5 0 109.5 9.5A9.51 9.51 0 0010 .5Zm.5 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0ZM12 15H8a1 1 0 110-2h1v-3H8a1 1 0 110-2h2a1 1 0 011 1v4h1a1 1 0 010 2z" />
                    </svg>
                    <h2 className="text-lg font-semibold">{title}</h2>
                </div>

                <div className="p-5">
                    <p className="text-sm text-gray-700">{message}</p>
                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            ref={btnRef}
                            onClick={onConfirm}
                            className={`px-4 py-2 border rounded-md text-white ${v.btn}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
