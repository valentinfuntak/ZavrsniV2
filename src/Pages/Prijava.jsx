import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router'; 
import { useAuth } from "../auth/AuthProvider";
import supabase from '../Backend/supabaseClient';
import Plane from "../assets/planefav.png";

function Prijava(props) {
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [error, setError] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [rememberMe, setRememberMe] = createSignal(false);
    
    const navigate = useNavigate(); // Inicijaliziraj navigaciju

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email(),
                password: password()
            });

            if (error) {
                setError('Neispravni podaci za prijavu.');
                console.log(error.message);
            } else {
                // Ako su podaci ispravni, preusmjerite korisnika na početnu stranicu
                navigate('/pocetna'); // Preusmjeravanje na početnu
            }
        } catch (err) {
            setError('Došlo je do pogreške pri prijavi.');
            console.error(err); // Logirajte pogreške
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section class="bg-gray-50 dark:bg-gray-900">
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img class="w-8 h-8 mr-2" src={Plane} alt="logo" />
                        Plane Spotter
                    </a>
                    <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Prijava
                            </h1>
                            <form class="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                                <div>
                                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name@company.com"
                                        value={email()}
                                        onInput={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Lozinka</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={password()}
                                        onInput={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input
                                                id="remember"
                                                aria-describedby="remember"
                                                type="checkbox"
                                                class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                                checked={rememberMe()}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                            />
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="remember" class=" text-gray-500 dark:text-gray-300">Zapamti podatke</label>
                                        </div>
                                    </div>
                                    <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Zaboravljena lozinka?</a>
                                </div>
                                {error() && (
                                    <div class="text-red-500 text-sm">{error()}</div>
                                )}
                                <button
                                    type="submit"
                                    class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    disabled={loading()}
                                >
                                    {loading() ? 'Prijava...' : 'Prijava'}
                                </button>
                                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Nemate račun? <a href="/" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Registracija</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Prijava;
