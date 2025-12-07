import { Head, useForm } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import FlashMessages from '@/Components/FlashMessages';

export default function ForgotPassword({ auth, status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div
            className="relative h-screen overflow-hidden bg-cover bg-center text-white animate-fade-in"
            style={{ backgroundImage: "url('/images/bg (homepage).jpg')" }}
        >
            <Head title="Forgot Password" />
            <FlashMessages />
            <Navbar auth={auth} />

            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: "url('/images/bg (homepage).jpg')" }}
            >
                <main className="relative z-10 flex flex-col items-start justify-center min-h-[93vh] px-8 md:px-32 lg:px-40">
                    <div className="relative pl-40">
                        <div className="speech-bubble absolute -top-20 left-10 bg-white text-black p-4 rounded-xl shadow-xl max-w-xs mt-40">
                            <p className="text-sm md:text-base">
                                Forgot your password? We can help you get back in quickly.
                            </p>
                        </div>

                        <img
                            src="/images/cat pc.png"
                            alt="Floating Cat"
                            className="floating-cat w-96 md:w-[28rem] lg:w-[32rem] object-contain mb-6 drop-shadow-lg translate-x-10 mt-40"
                        />
                    </div>
                </main>
            </div>

            <div className="relative z-20 flex items-start justify-end h-screen pt-40 mt-10 mr-80 px-4">
                <div className="w-full max-w-lg bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl p-8 text-white animate-slide-up">
                    <h2 className="text-center text-2xl font-semibold mb-5">Reset Password</h2>
                    <p className="text-center text-sm text-gray-300 mb-6">
                        Enter the email linked to your account and we’ll send a secure reset link.
                    </p>

                    {status && (
                        <div className="text-center p-2 text-green-400">{status}</div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="text-sm">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                            )}
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-300">
                            <span>Need more help? Contact support.</span>
                            <a href="/login" className="text-yellow-400 hover:text-yellow-300">
                                Back to login
                            </a>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition active:scale-95"
                            >
                                Email Reset Link
                            </button>
                        </div>
                    </form>
                </div>
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

                .speech-bubble::after {
                    content: '';
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
