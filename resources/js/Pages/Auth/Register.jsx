import { Link, useForm } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import { useState } from "react";

export default function Register({ auth }) {
    const [showPwd, setShowPwd] = useState(false);
    const [showPwdConfirm, setShowPwdConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div
            className="relative h-screen overflow-hidden bg-cover bg-center text-white animate-fade-in"
            style={{ backgroundImage: "url('/images/bg (homepage).jpg')" }}
        >
            <Navbar auth={auth} />

            {/* BLURRED BACKGROUND CONTENT */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: "url('/images/bg (homepage).jpg')" }}
            >
                {/* Left-side main content */}
                <main className="relative z-10 flex flex-col items-start justify-center min-h-[93vh] px-8 md:px-32 lg:px-40">
                    {/* CAT + BUBBLE WRAPPER */}
                    <div className="relative pl-40">
                        {/* SPEECH BUBBLE ABOVE CAT */}
                        <div className="speech-bubble absolute -top-20 left-10 bg-white text-black p-4 rounded-xl shadow-xl max-w-xs mt-40">
                            <p className="text-sm md:text-base font-small">
                                Let’s keep the community safe together! Log in
                                to report.
                            </p>
                        </div>

                        {/* FLOATING CAT */}
                        <img
                            src="/images/logo_cat.png"
                            alt="Floating Cat"
                            className="floating-cat w-96 md:w-[28rem] lg:w-[32rem] object-contain mb-6 drop-shadow-lg translate-x-10 mt-40"
                        />
                    </div>

                    <style>
                        {`
        .floating-cat {
            animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0px); }
        }

        .speech-bubble {
            animation: float 4s ease-in-out infinite;
        }

        /* smoother tail */
        .speech-bubble::after {
            content: "";
            position: absolute;
            bottom: -10px;
            left: 160px;
            width: 18px;
            height: 18px;
            background: white;
            transform: rotate(45deg);
            border-radius: 3px;
            box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        `}
                    </style>
                </main>
            </div>

            {/* REGISTER FORM */}
            <div className="relative z-20 flex items-start justify-end h-screen pt-40 mt-10 mr-80 px-4">
                <div
                    className="w-full max-w-lg bg-black/70 backdrop-blur-xl border border-white/10
                    rounded-xl shadow-xl p-8 text-white animate-slide-up"
                >
                    <h2 className="text-center text-2xl font-semibold mb-5">
                        Create an Account
                    </h2>

                    <form onSubmit={submit} className="space-y-5">
                        {/* NAME */}
                        <div>
                            <label className="text-sm">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/20
                                    rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
                                required
                            />
                            {errors.name && (
                                <p className="text-red-400 text-sm mt-2">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="text-sm">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/20
                                    rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
                                required
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-2">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* PASSWORD with visibility toggle */}
                        <div>
                            <label className="text-sm">Password</label>
                            <div className="relative">
                                <input
                                    type={showPwd ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="mt-1 w-full px-4 py-2 pr-12 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    aria-label={
                                        showPwd
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-white/70 hover:text-white"
                                >
                                    {showPwd ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                            <path
                                                fillRule="evenodd"
                                                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                            <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                            <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-2">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* CONFIRM PASSWORD with visibility toggle */}
                        <div>
                            <label className="text-sm">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showPwdConfirm ? "text" : "password"}
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 w-full px-4 py-2 pr-12 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPwdConfirm(!showPwdConfirm)
                                    }
                                    aria-label={
                                        showPwdConfirm
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-white/70 hover:text-white"
                                >
                                    {showPwdConfirm ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                            <path
                                                fillRule="evenodd"
                                                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                            <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                            <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-red-400 text-sm mt-2">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-300">
                                Already registered?{" "}
                                <Link
                                    href={route("login")}
                                    className="text-yellow-400 hover:text-yellow-300 hover:underline transition"
                                >
                                    Login
                                </Link>
                            </p>

                            <div className="flex items-center space-x-3">
                                {/* Cancel Button */}
                                <Link
                                    href="/"
                                    className="px-5 py-2 border border-white text-white font-medium rounded-md
                                            hover:bg-white hover:text-black transition active:scale-95"
                                >
                                    Cancel
                                </Link>

                                {/* Register Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-yellow-400 text-black font-semibold
                                    rounded-md hover:bg-yellow-300 transition active:scale-95"
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* ANIMATIONS */}
            <style>
                {`
                .animate-fade-in {
                    animation: fadeIn 0.8s ease forwards;
                }
                .animate-slide-up {
                    animation: slideUp 0.7s ease forwards;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
        </div>
    );
}
