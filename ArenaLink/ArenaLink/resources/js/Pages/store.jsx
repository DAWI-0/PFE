import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Store({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Store</h2>}
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Contenu de votre page Store
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}