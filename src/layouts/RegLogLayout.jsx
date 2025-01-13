import { AuthProvider, useAuth } from "../Auth/AuthProvider";

export default function RegLogLayout(props) {
    const session = useAuth();

    return (
        <>
            <div class="bg-gray-900 text-gray-100 min-h-screen">
                <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">{props.children}</div>
                {/* PRIKAZ PODNOŽJE */}
                <footer class="bg-gray-900 dark:bg-gray-900">
                    <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                    </div>
                </footer>
            </div>
        </>
    );
}
