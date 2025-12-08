import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { usePage } from "@inertiajs/react";

export default function BanInfo({ auth, bannedByAdmin }) {
    const { user } = usePage().props;

    if (!user?.report_banned) {
        return (
            <>
                <Navbar auth={auth} />
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Access Denied
                        </h2>
                        <p className="text-gray-600">
                            You are not banned. You can continue to submit
                            reports.
                        </p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar auth={auth} />
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Header - Red to indicate ban */}
                        <div className="bg-red-600 text-white px-6 py-8">
                            <h1 className="text-3xl font-bold mb-2">
                                Account Restricted
                            </h1>
                            <p className="text-red-100">
                                Your account has been restricted from posting
                                reports
                            </p>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-8 space-y-6">
                            {/* Ban Reason */}
                            <div className="border-l-4 border-red-600 pl-6 py-4 bg-red-50 rounded">
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                    Reason for Restriction
                                </h2>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {user.report_ban_reason ||
                                        "No reason provided"}
                                </p>
                            </div>
                            {/* Ban Details */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Restricted Since
                                    </p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {user.report_banned_at
                                            ? new Date(
                                                  user.report_banned_at
                                              ).toLocaleString()
                                            : "Unknown"}
                                    </p>
                                </div>

                                {bannedByAdmin && (
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Restricted By
                                        </p>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {bannedByAdmin.name} (Admin)
                                        </p>
                                    </div>
                                )}
                            </div>
                            {/* Information
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-900 mb-2">
                                    What does this mean?
                                </h3>
                                <ul className="text-sm text-blue-800 space-y-2">
                                    <li>
                                        • You cannot submit new reports at this
                                        time
                                    </li>
                                    <li>
                                        • You can still view and vote on other
                                        reports
                                    </li>
                                    <li>• You can still comment on reports</li>
                                    <li>
                                        • Contact an administrator if you
                                        believe this is a mistake
                                    </li>
                                </ul>
                            </div> */}
                            {/* Contact Info */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    Need Help?
                                </h3>
                                <p className="text-gray-700 text-sm mb-3">
                                    If you believe this restriction is unjust or
                                    would like to appeal, please contact an
                                    administrator.
                                </p>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>
                                        <span className="font-semibold">
                                            Email:
                                        </span>{" "}
                                        admin@icare.local
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Office Hours:
                                        </span>{" "}
                                        Monday - Friday, 9 AM - 5 PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back to Reports */}
                    <div className="mt-6 text-center">
                        <a
                            href={route("reports")}
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Back to Reports
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
