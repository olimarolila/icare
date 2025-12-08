import { Head, useForm } from '@inertiajs/react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const InputError = ({ message, className = '', ...props }) => {
    return message ? (
        <p {...props} className={'text-sm text-red-600 ' + className}>
            {message}
        </p>
    ) : null;
};

const InputLabel = ({ value, className = '', children, ...props }) => (
    <label
        {...props}
        className={`block font-medium text-sm text-gray-700 ${className}`}
    >
        {value ? value : children}
    </label>
);

const PrimaryButton = ({ className = '', disabled, children, ...props }) => (
    <button
        {...props}
        className={
            `inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900 ${
                disabled && 'opacity-25'
            } ` + className
        }
        disabled={disabled}
    >
        {children}
    </button>
);

const TextInput = forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ' +
                className
            }
            ref={localRef}
        />
    );
});

export default function ResetPassword({ token, email, auth, status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div
            className="relative h-screen overflow-hidden bg-cover bg-center text-white animate-fade-in"
            style={{ backgroundImage: "url('/images/bg (homepage).jpg')" }}
        >
            <Head title="Reset Password" />

            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: "url('/images/bg (homepage).jpg')" }}
            >
                <main className="relative z-10 flex flex-col items-start justify-center min-h-[93vh] px-8 md:px-32 lg:px-40">
                    <div className="relative pl-40">
                        <div className="speech-bubble absolute -top-20 left-10 bg-white text-black p-4 rounded-xl shadow-xl max-w-xs mt-40">
                            <p className="text-sm md:text-base">
                                Need to set a new password? Enter your details securely here.
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
                        Choose a strong new password for your account.
                    </p>

                    {status && (
                        <div className="text-center p-2 text-green-400">{status}</div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="email" value="Email" className="text-white" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full bg-white/10 border border-white/20 text-white"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="New Password" className="text-white" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full bg-white/10 border border-white/20 text-white"
                                autoComplete="new-password"
                                isFocused={true}
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirm New Password"
                                className="text-white"
                            />

                            <TextInput
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full bg-white/10 border border-white/20 text-white"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                            />

                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={processing}>
                                Reset Password
                            </PrimaryButton>
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
