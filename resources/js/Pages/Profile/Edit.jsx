import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CitizenLayout from "@/Layouts/CitizenLayout";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { forwardRef,  useEffect,  useImperativeHandle, useRef, useState } from "react";

const InputError = ({ message, className = "", ...props }) =>
    message ? (
        <p {...props} className={`text-sm text-red-600 ${className}`}>
            {message}
        </p>
    ) : null;

const InputLabel = ({ value, className = "", children, ...props }) => (
    <label
        {...props}
        className={`block font-medium text-sm text-white/90 ${className}`}
    >
        {value ? value : children}
    </label>
);

const SecondaryButton = ({
    type = "button",
    className = "",
    disabled,
    children,
    ...props
}) => (
    <button
        {...props}
        type={type}
        className={`inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 ${
            disabled ? "opacity-25" : ""
        } ${className}`}
        disabled={disabled}
    >
        {children}
    </button>
);

const DangerButton = ({ className = "", disabled, children, ...props }) => (
    <button
        {...props}
        className={`inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700 ${
            disabled ? "opacity-25" : ""
        } ${className}`}
        disabled={disabled}
    >
        {children}
    </button>
);

const PrimaryButton = ({ className = "", disabled, children, ...props }) => (
    <button
        {...props}
        className={`inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900 ${
            disabled ? "opacity-25" : ""
        } ${className}`}
        disabled={disabled}
    >
        {children}
    </button>
);

const TextInput = forwardRef(function TextInput(
    { type = "text", className = "", isFocused = false, ...props },
    ref
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
            className={`rounded-md border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${className}`}
            ref={localRef}
        />
    );
});

const Modal = ({
    children,
    show = false,
    maxWidth = "2xl",
    closeable = true,
    onClose = () => {},
}) => {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex transform items-center overflow-y-auto px-4 py-6 transition-all sm:px-0"
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-500/75" />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className={`mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full ${maxWidthClass}`}
                    >
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
};

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isCitizen = user?.role === "citizen";
    const LayoutWrapper = isCitizen ? CitizenLayout : AuthenticatedLayout;
    const layoutProps = isCitizen ? {} : { header: null };

    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const deletePasswordInputRef = useRef(null);
    const currentPasswordInputRef = useRef(null);
    const newPasswordInputRef = useRef(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showDeletePassword, setShowDeletePassword] = useState(false);

    const {
        data: profileData,
        setData: setProfileData,
        patch: patchProfile,
        errors: profileErrors,
        processing: profileProcessing,
        recentlySuccessful: profileRecentlySuccessful,
    } = useForm({
        name: user.name,
        email: user.email,
    });

    const {
        data: passwordData,
        setData: setPasswordData,
        errors: passwordErrors,
        put: updatePasswordRequest,
        reset: resetPasswordFields,
        processing: passwordProcessing,
        recentlySuccessful: passwordRecentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const {
        data: deleteData,
        setData: setDeleteData,
        delete: destroyAccount,
        processing: deleteProcessing,
        reset: resetDeleteForm,
        errors: deleteErrors,
        clearErrors: clearDeleteErrors,
    } = useForm({
        password: "",
    });

    const submitProfile = (e) => {
        e.preventDefault();
        patchProfile(route("profile.update"));
    };

    const submitPassword = (e) => {
        e.preventDefault();
        updatePasswordRequest(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => resetPasswordFields(),
            onError: (errors) => {
                if (errors.password) {
                    resetPasswordFields("password", "password_confirmation");
                    newPasswordInputRef.current?.focus();
                }

                if (errors.current_password) {
                    resetPasswordFields("current_password");
                    currentPasswordInputRef.current?.focus();
                }
            },
        });
    };

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const closeDeleteModal = () => {
        setConfirmingUserDeletion(false);
        clearDeleteErrors();
        resetDeleteForm();
    };

    const handleDeleteAccount = (e) => {
        e.preventDefault();

        destroyAccount(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeDeleteModal(),
            onError: () => deletePasswordInputRef.current?.focus(),
            onFinish: () => resetDeleteForm(),
        });
    };

    return (
        <LayoutWrapper {...layoutProps}>
            <Head title="Profile" />

            <div
                className={
                    isCitizen
                        ? ""
                        : "px-6 md:px-12 lg:px-20 xl:px-24 py-10"
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        <div className="md:col-span-4 lg:col-span-4 xl:col-span-3">
                            <aside className="bg-neutral-900/90 border border-white/10 rounded-2xl shadow-2xl p-6 sticky top-6 space-y-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-white/60">Logged in as</p>
                                        <h2 className="text-2xl font-bold text-white">
                                            {user.name}
                                        </h2>
                                        <p className="text-sm text-white/70 break-words">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-lg font-semibold text-black/80">
                                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                </div>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    Use these controls to manage your account, keep your
                                    credentials secure, and remove access when necessary. All
                                    changes save instantly with visual feedback.
                                </p>
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
                                    >
                                        ← Back to previous page
                                    </button>
                                    <div className="bg-black/30 border border-white/10 rounded-xl p-4 space-y-2 text-sm text-white/70">
                                        <div>
                                            <p className="text-white/80 font-semibold">
                                                Quick Tips
                                            </p>
                                            <ul className="list-disc list-inside space-y-1 text-white/70">
                                                <li>Keep your email verified for alerts.</li>
                                                <li>Update your password regularly.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                        <div className="md:col-span-8 lg:col-span-8 xl:col-span-9 flex flex-col space-y-6">
                            <div className="bg-neutral-900/95 border border-white/10 rounded-2xl shadow-2xl p-6">
                                <section className="max-w-3xl">
                                    <header>
                                        <h2 className="text-lg font-semibold text-white">
                                            Profile Information
                                        </h2>

                                        <p className="mt-1 text-sm text-white/70">
                                            Update your account's profile information and email
                                            address.
                                        </p>
                                    </header>

                                    <form
                                        onSubmit={submitProfile}
                                        className="mt-6 space-y-6"
                                    >
                                        <div>
                                            <InputLabel htmlFor="name" value="Name" />

                                            <TextInput
                                                id="name"
                                                className="mt-1 block w-full"
                                                value={profileData.name}
                                                onChange={(e) =>
                                                    setProfileData("name", e.target.value)
                                                }
                                                required
                                                isFocused
                                                autoComplete="name"
                                            />

                                            <InputError
                                                className="mt-2"
                                                message={profileErrors.name}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="email" value="Email" />

                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full"
                                                value={profileData.email}
                                                onChange={(e) =>
                                                    setProfileData("email", e.target.value)
                                                }
                                                required
                                                autoComplete="username"
                                            />

                                            <InputError
                                                className="mt-2"
                                                message={profileErrors.email}
                                            />
                                        </div>

                                        {mustVerifyEmail &&
                                            user.email_verified_at === null && (
                                                <div>
                                                    <p className="mt-2 text-sm text-white/80">
                                                        Your email address is unverified.
                                                        <Link
                                                            href={route("verification.send")}
                                                            method="post"
                                                            as="button"
                                                            className="rounded-md text-sm text-yellow-300 underline hover:text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
                                                        >
                                                            Click here to re-send the verification
                                                            email.
                                                        </Link>
                                                    </p>

                                                    {status === "verification-link-sent" && (
                                                        <div className="mt-2 text-sm font-medium text-green-400">
                                                            A new verification link has been sent to
                                                            your email address.
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        <div className="flex items-center gap-4">
                                            <PrimaryButton disabled={profileProcessing}>
                                                Save
                                            </PrimaryButton>

                                            <Transition
                                                show={profileRecentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-white/70">
                                                    Saved.
                                                </p>
                                            </Transition>
                                        </div>
                                    </form>
                                </section>
                            </div>

                            <div className="bg-neutral-900/95 border border-white/10 rounded-2xl shadow-2xl p-6">
                                <section className="max-w-3xl">
                                    <header>
                                        <h2 className="text-lg font-semibold text-white">
                                            Update Password
                                        </h2>

                                        <p className="mt-1 text-sm text-white/70">
                                            Ensure your account is using a long, random password
                                            to stay secure.
                                        </p>
                                    </header>

                                    <form
                                        onSubmit={submitPassword}
                                        className="mt-6 space-y-6"
                                    >
                                        <div>
                                            <InputLabel
                                                htmlFor="current_password"
                                                value="Current Password"
                                            />

                                            <div className="relative">
                                                <TextInput
                                                    id="current_password"
                                                    ref={currentPasswordInputRef}
                                                    value={passwordData.current_password}
                                                    onChange={(e) =>
                                                        setPasswordData(
                                                            "current_password",
                                                            e.target.value
                                                        )
                                                    }
                                                    type={
                                                        showCurrentPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    className="mt-1 block w-full pr-12"
                                                    autoComplete="current-password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowCurrentPassword(
                                                            (prev) => !prev
                                                        )
                                                    }
                                                    aria-label={
                                                        showCurrentPassword
                                                            ? "Hide current password"
                                                            : "Show current password"
                                                    }
                                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                                                >
                                                    {showCurrentPassword ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="w-5 h-5"
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
                                                            className="w-5 h-5"
                                                        >
                                                            <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                                            <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                                            <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>

                                            <InputError
                                                message={passwordErrors.current_password}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="password" value="New Password" />

                                            <div className="relative">
                                                <TextInput
                                                    id="password"
                                                    ref={newPasswordInputRef}
                                                    value={passwordData.password}
                                                    onChange={(e) =>
                                                        setPasswordData(
                                                            "password",
                                                            e.target.value
                                                        )
                                                    }
                                                    type={
                                                        showNewPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    className="mt-1 block w-full pr-12"
                                                    autoComplete="new-password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowNewPassword(
                                                            (prev) => !prev
                                                        )
                                                    }
                                                    aria-label={
                                                        showNewPassword
                                                            ? "Hide new password"
                                                            : "Show new password"
                                                    }
                                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                                                >
                                                    {showNewPassword ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="w-5 h-5"
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
                                                            className="w-5 h-5"
                                                        >
                                                            <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                                            <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                                            <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>

                                            <InputError
                                                message={passwordErrors.password}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="password_confirmation"
                                                value="Confirm Password"
                                            />

                                            <div className="relative">
                                                <TextInput
                                                    id="password_confirmation"
                                                    value={passwordData.password_confirmation}
                                                    onChange={(e) =>
                                                        setPasswordData(
                                                            "password_confirmation",
                                                            e.target.value
                                                        )
                                                    }
                                                    type={
                                                        showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    className="mt-1 block w-full pr-12"
                                                    autoComplete="new-password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            (prev) => !prev
                                                        )
                                                    }
                                                    aria-label={
                                                        showConfirmPassword
                                                            ? "Hide confirm password"
                                                            : "Show confirm password"
                                                    }
                                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                                                >
                                                    {showConfirmPassword ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="w-5 h-5"
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
                                                            className="w-5 h-5"
                                                        >
                                                            <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                                            <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                                            <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>

                                            <InputError
                                                message={passwordErrors.password_confirmation}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <PrimaryButton disabled={passwordProcessing}>
                                                Save
                                            </PrimaryButton>

                                            <Transition
                                                show={passwordRecentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-white/70">
                                                    Saved.
                                                </p>
                                            </Transition>
                                        </div>
                                    </form>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
        </LayoutWrapper>
    );
}