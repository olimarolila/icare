import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AdminReports() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Admin Reports
                </h2>
            }
        >
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <p className="text-gray-700">
                            Reports dashboard coming soon.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
