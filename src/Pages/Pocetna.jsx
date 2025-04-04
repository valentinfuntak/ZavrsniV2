import { useAuth } from "../Auth/AuthProvider.jsx";
import { useNavigate } from "@solidjs/router";
import { createEffect, Show } from "solid-js";
import { userLeadenboard, getUserLeadenboard } from "../Backend/supabaseClient.js";

function Pocetna() {
    const session = useAuth();
    const navigate = useNavigate();
    getUserLeadenboard();

    createEffect(() => {
        if (session() === null) {
            navigate("/AuthError");
        }
    });

    return (
        <div class="min-h-screen bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex flex-col justify-center items-center text-white">
            <div class="text-center w-full p-6">
                <h1 class="font-mono text-5xl font-bold mb-4">Dobrodošli na Planespotter</h1>
                <p class="text-lg mb-8">
                    Ova aplikacija omogućava skeniranje neba i praćenje aviona u stvarnom vremenu.
                    Saznajte više o letovima u vašem području!
                </p>
                <div class="w-full max-w-7xl mx-auto overflow-x-auto shadow-md sm:rounded-lg mt-5">
                    <table class="w-full text-xs text-left rtl:text-right text-gray-400">


                        <caption class="p-5 text-base font-semibold text-left rtl:text-right text-white bg-gray-800">
                            Najveći ulovi ove sezone
                            <p class="mt-1 text-base font-normal text-gray-400">
                                Ovdje se nalaze prvih 50 najvećih ulova ove sezone.
                                Najbolji igrači raspoređeni su prema rijetkosti ulova.
                                Želimo Vam sretan nastavak lova, Godspeed!
                            </p>
                        </caption>
                        <thead class="text-xs uppercase bg-gray-700 text-white">
                            <tr>
                                <th scope="col" class="px-3 py-3">Poredak</th>
                                <th scope="col" class="px-3 py-3">Korisnik</th>
                                <th scope="col" class="px-3 py-3">Model</th>
                                <th scope="col" class="px-3 py-3">Broj modela</th>
                            </tr>
                        </thead>
                        <tbody>
                            <For each={userLeadenboard()} fallback={<tr><td colspan="7" class="text-center py-4">Greška pri dohvaćanju ljestvice!</td></tr>}>
                                {(userLd, index) => (
                                    <Show when={userLd.modelnum}>
                                        <tr class=" odd:bg-gray-900 even:bg-gray-800 border-b first:border-yellow-500  first:text-yellow-500 [&:nth-child(2)]:border-slate-200 [&:nth-child(2)]:text-slate-200 [&:nth-child(3)]:border-amber-600 [&:nth-child(3)]:text-amber-600 border-gray-600">
                                            <td class="px-6 py-4 font-medium  text-white">{`${index() + 1}.`}</td>
                                            <td class="px-6 py-4 font-medium text-white">{userLd.username}</td>
                                            <td class="px-6 py-4">{userLd.model}</td>
                                            <td class="px-6 py-4">{userLd.modelnum}</td>
                                        </tr>
                                    </Show>
                                )}
                            </For>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Pocetna;
