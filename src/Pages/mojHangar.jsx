import { useAuth } from "../Auth/AuthProvider.jsx";
import { useNavigate } from "@solidjs/router";
import { createEffect, onMount } from "solid-js";
import { dohvatiHangar } from "../Backend/supabaseClient.js";
import { konverzijaDatum } from "../Components/Navigacija.jsx";

function mojHangar(props) {
    const session = useAuth();
    const navigate = useNavigate();

    createEffect(() => {
        if (session() === null) {
            navigate("/AuthError");
        }
    });

    onMount(() => {
        dohvatiHangar();
    });

    const [cards] = createResource(dohvatiHangar);

    const PrikaziKartice = (card) => {
        if (card.modelNum > 9000) {
            return (
                <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{card.model}, COMMON</h5>
                    <p class="pt-5 font-normal text-gray-700 dark:text-gray-400">Pronađen: {konverzijaDatum(card.time)}</p>
                    <p class="pt-5 font-normal text-gray-700 dark:text-gray-400">Brzina i visina: {card.speed}, {card.altitude}</p>
                    <p class="pt-5 font-normal text-gray-700 dark:text-gray-400">Opis: {card.description}</p>
                    <p class="pt-8 font-normal text-gray-700 dark:text-gray-400">Broj proizvedenih modela: {card.modelNum}</p>
                </div>
            );
        } else if (card.modelNum > 1000 && card.modelNum <= 9000) {
            return (
                <div class="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{card.model}, RARE</h5>
                    <p class="pt-5 font-normal text-gray-700 dark:text-gray-400">Pronađen: {konverzijaDatum(card.time)}</p>
                    <p class="pt-5 font-normal text-gray-700 dark:text-gray-400">Brzina i visina: {card.speed}, {card.altitude}</p>
                    <p class="pt-5 font-normal text-gray-700 dark:text-gray-400">Opis: {card.description}</p>
                    <p class="pt-8 font-normal text-gray-700 dark:text-gray-400">Broj proizvedenih modela: {card.modelNum}</p>
                </div>
            );
        } else if (card.modelNum <= 1000 && card.modelNum > 100) {
            return (
                <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{card.model}, EPIC</h5>
                    <p class="pt-5 font-normal text-gray-700 dark:text-gray-400">Pronađen: {konverzijaDatum(card.time)}</p>
                    <p class="pt-5 font-normal text-gray-700 dark:text-gray-400">Brzina i visina: {card.speed}, {card.altitude}</p>
                    <p class="pt-5 font-normal text-gray-700 dark:text-gray-400">Opis: {card.description}</p>
                    <p class="pt-8 font-normal text-gray-700 dark:text-gray-400">Broj proizvedenih modela: {card.modelNum}</p>
                </div>
            );
        } else if (card.modelNum <= 100) {
            return (
                <div class="bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{card.model}, LEGENDARY</h5>
                    <p class="pt-5 font-normal text-gray-700 dark:text-gray-400">Pronađen: {konverzijaDatum(card.time)}</p>
                    <p class="pt-5 font-normal text-gray-700 dark:text-gray-400">Brzina i visina: {card.speed}, {card.altitude}</p>
                    <p class="pt-5 font-normal text-gray-700 dark:text-gray-400">Opis: {card.description}</p>
                    <p class="pt-8 font-normal text-gray-700 dark:text-gray-400">Broj proizvedenih modela: {card.modelNum}</p>
                </div>
            );
        }
    return (
        <For 
            each={cards()} 
            fallback={<tr><td colspan="7" class="text-center py-4">Trenutno nema aviona</td></tr>}
        >
            {(card) => PrikaziKartice(card)}
        </For>
    );
}
}
export default mojHangar;
