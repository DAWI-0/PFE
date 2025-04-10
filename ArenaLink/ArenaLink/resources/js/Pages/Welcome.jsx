import { Head } from '@inertiajs/react';
import Acceuil from './acceuil/Acceuil'; // Ensure the path is correct

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            {/* <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50"> */}
            <div>
                {/* Acceuil Component */}
                <div>
                    <Acceuil />
                </div>
            </div>
        </>
    );
}