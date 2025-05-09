import { useAuth } from "../Auth/AuthProvider.jsx";
import { useNavigate } from "@solidjs/router";
import { createEffect, createResource, createSignal, onMount } from "solid-js";
import { dohvatiSve } from "../Backend/supabaseClient.js";
import { konverzijaDatum } from "../Components/Navigacija.jsx";

function MojHangar(props) {
    const session = useAuth();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = createSignal(1);
    const itemsPerPage = 5; 

    createEffect(() => {
        if (session() === null) {
            navigate("/AuthError");
        }
    });

    onMount(() => {
        const searchInput = document.querySelector("#search-input");
        if (searchInput) {
            searchInput.addEventListener("input", pretraga);
        }
    });

    function pretraga() {
        const unos = document.querySelector("#search-input");
        const filter = unos.value.toLowerCase();
        const prikazi = document.querySelectorAll(".custom-card");

        prikazi.forEach((item) => {
            let text = item.querySelector("#naslov").textContent;
            if (text.toLowerCase().includes(filter.toLowerCase())) {
                item.style.display = ``;
            } else {
                item.style.display = `none`;
            }
        });
    }

    function GenerirajKarticu(kartica) {
        if (kartica.modelnum === null) {
            return (
                <div class="custom-card content-center pb-8 pt-9 flex items-center justify-center">
                    <div class="bg-gradient-to-r from-slate-200 to-stone-400 block max-w-sm p-6 bg-white border border-white-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <h5 id="naslov" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{kartica.model}, ???</h5>
                        <p class="pt-5 font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                        <p class="pt-5 font-bold text-black dark:text-black">Registracija: {kartica.registration}</p>
                        <p class="pt-5 font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                        <p class="pt-5 font-bold text-black dark:text-black">Opis: Nije istraženo!</p>
                        <p class="pt-7 font-bold text-black dark:text-black">Broj proizvedenih modela: Nije istraženo!</p>
                        <Show when={kartica.livery !== null} fallback={null}>  <p class="pt-7 font-bold text-black dark:text-black">Livreja: {kartica.livery}</p> </Show>
                    </div>
                </div>
            );
        } else if (kartica.modelnum > 1000) {
            return (
                <div class="custom-card content-center pb-8 pt-9 flex items-center justify-center">
                    <div class="content-center p-5 flex items-center justify-center bg-red-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-fushia-100 animate-glow duration-1000 delay-200">
                        <div class="bg-gradient-to-r from-red-200 via-fushia-300 to-rose-500 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <h5 id="naslov" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{kartica.model}, COMMON</h5>
                            <Show when={kartica.url !== null} fallback={null}> <img class="pr-2 mb-2 mt-5 rounded-2xl" src={kartica.url}></img></Show>
                            <p class="pt-5 font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                            <p class="pt-5 font-bold text-black dark:text-black">Registracija: {kartica.registration}</p>
                            <p class="pt-5 font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                            <p class="pt-5 font-bold text-black dark:text-black">Opis: {kartica.description}</p>
                            <p class="pt-7 font-bold text-black dark:text-black">Broj proizvedenih modela: {kartica.modelnum}</p>
                            <Show when={kartica.livery !== null} fallback={null}>  <p class="pt-7 font-bold text-black dark:text-black">Livreja: {kartica.livery}</p> </Show>
                        </div>
                    </div>
                </div>

            );
        } else if (kartica.modelnum < 1000 && kartica.modelnum >= 200) {
            console.log(kartica.url);
            return (

                <div class="custom-card content-center pb-8 pt-9 flex items-center justify-center">
                    <div class="content-center p-5 flex items-center justify-center bg-indigo-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 animate-glow2 duration-1000 delay-200">
                        <div class="bg-gradient-to-r from-indigo-300 via-sky-500 to-emerald-500 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <h5 id="naslov" class="mb-2 text-2xl font-bold tracking-tight  text-gray-900 dark:text-white">{kartica.model}, RARE</h5>
                            <Show when={kartica.url !== null} fallback={null}> <img class="pr-2 mb-2 mt-5 rounded-2xl" src={kartica.url}></img></Show>
                            <p class="pt-5 font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                            <p class="pt-5 font-bold text-black dark:text-black">Registracija: {kartica.registration}</p>
                            <p class="pt-5 font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                            <p class="pt-5 font-bold text-black dark:text-black">Opis: {kartica.description}</p>
                            <p class="pt-7 font-bold text-black dark:text-black">Broj proizvedenih modela: {kartica.modelnum}</p>
                            <Show when={kartica.livery !== null} fallback={null}>  <p class="pt-7 font-bold text-black dark:text-black">Livreja: {kartica.livery}</p> </Show>
                        </div>
                    </div>
                </div>
            );
        } else if (kartica.modelnum <= 200 && kartica.modelnum > 40) {
            return (
                <div class="custom-card content-center pb-8 pt-9 flex items-center justify-center">
                    <div class="content-center p-5 flex items-center justify-center bg-purple-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 animate-glow3 duration-1000 delay-200">
                        <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <h5 id="naslov" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{kartica.model}, EPIC</h5>
                            <Show when={kartica.url !== null} fallback={null}> <img class="pr-2 mb-2 mt-5 rounded-2xl" src={kartica.url}></img></Show>
                            <p class="pt-5 font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                            <p class="pt-5 font-bold text-black dark:text-black">Registracija: {kartica.registration}</p>
                            <p class="pt-5 font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                            <p class="pt-5 font-bold text-black dark:text-black">Opis: {kartica.description}</p>
                            <p class="pt-7 font-bold text-black dark:text-black">Broj proizvedenih modela: {kartica.modelnum}</p>
                            <Show when={kartica.livery !== null} fallback={null}>  <p class="pt-7 font-bold text-black dark:text-black">Livreja: {kartica.livery}</p> </Show>
                        </div>
                    </div>
                </div>
            );
        } else if (kartica.modelnum <= 40) {
            return (
                <div class="custom-card content-center pb-8 pt-9 flex items-center justify-center">
                    <div class="content-center p-5 flex items-center justify-center  bg-yellow-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 animate-glow4 duration-1000 delay-200">
                        <div class="bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <h5 id="naslov" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{kartica.model}, LEGENDARY</h5>
                            <Show when={kartica.url !== null} fallback={null}> <img class="pr-2 mb-2 mt-5 rounded-2xl" src={kartica.url}></img></Show>
                            <p class="pt-5  font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                            <p class="pt-5 font-bold text-black dark:text-black">Registracija: {kartica.registration}</p>
                            <p class="pt-5  font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                            <p class="pt-5  font-bold text-black dark:text-black">Opis: {kartica.description}</p>
                            <p class="pt-7  font-bold text-black dark:text-black">Broj proizvedenih modela: {kartica.modelnum}</p>
                            <Show when={kartica.livery !== null} fallback={null}>  <p class="pt-7 font-bold text-black dark:text-black">Livreja: {kartica.livery}</p> </Show>
                        </div>
                    </div>
                </div>
            );
        }

    }

    const [kartice] = createResource(session().user.id, dohvatiSve);

    function handlePageChange(page) {
        setCurrentPage(page);
    }

    const currentItems = () => {
        if (kartice()) {
            const startIndex = (currentPage() - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return kartice().slice(startIndex, endIndex);
        }
        return [];
    }
    
    const totalPages = () => {
        if (kartice()) {
            return Math.ceil(kartice().length / itemsPerPage);
        }
        return 1;
    }

    return (
        <>
            <div class="flex flex-row justify-center items-center space-x-2 flex-col md:flex-row">
                <h1 class="font-mono text-4xl leading-tight flex items-center min-w-20">Moj hangar</h1>
                <input type="text" class="form-control mt-10 text-black bg-slate-200 rounded md:w-55 w-55 h-8 mt-3 pl-3" autocomplete="off" id="search-input" placeholder="Pretraži..." />
            </div>

            <For each={currentItems()} fallback={<tr class="flex flex-row text-3xl text-yellow-300 justify-center items-center space-x-8 flex-col md:flex-row pt-20"><td colspan="7" class="text-center py-4">Trenutno nema aviona...</td></tr>}>
                {(kartica) => (
                    GenerirajKarticu(kartica)
                )}
            </For>

            <div class="flex justify-between items-center mt-5 w-full max-w-xs mx-auto">
                <button
                    class="bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    disabled={currentPage() === 1}
                    onClick={() => handlePageChange(currentPage() - 1)}
                >
                    ← Prethodna
                </button>
                <span class="font-semibold mx-4">{currentPage()} / {totalPages()}</span>
                <button
                    class="bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    disabled={currentPage() === totalPages()}
                    onClick={() => handlePageChange(currentPage() + 1)}
                >
                    Sljedeća →
                </button>
            </div>

        </>
    );
}

export default MojHangar;