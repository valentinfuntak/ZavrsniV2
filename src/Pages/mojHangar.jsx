import { useAuth } from "../Auth/AuthProvider.jsx";
import { useNavigate } from "@solidjs/router";
import { createEffect, createResource } from "solid-js";
import { dohvatiSve } from "../Backend/supabaseClient.js";
import { konverzijaDatum } from "../Components/Navigacija.jsx";

function MojHangar(props) {
    const session = useAuth();
    const navigate = useNavigate();

    createEffect(() => {
        if (session() === null) {
            navigate("/AuthError");
        }
    });

     function GenerirajKarticu(kartica){
       if (kartica.modelnum === null) {
            return (
                <div class="content-center pb-8 pt-9 flex items-center justify-center">
                <div class="bg-gradient-to-r from-slate-200 to-stone-400 block max-w-sm p-6 bg-white border border-white-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{kartica.model}, ???</h5>
                    <p class="pt-5 font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                    <p class="pt-5 font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                    <p class="pt-5 font-bold text-black dark:text-black">Opis: Nije istraženo!</p>
                    <p class="pt-7 font-bold text-black dark:text-black">Broj proizvedenih modela: Nije istraženo!</p>
                </div>
                </div>
            );
        } else if (kartica.modelnum > 9000) {
            return (
                <div class="content-center pb-8 pt-9 flex items-center justify-center">
                <div class="bg-gradient-to-r from-red-200 via-fushia-300 to-rose-500 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{kartica.model}, COMMON</h5>
                    <p class="pt-5 font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                    <p class="pt-5 font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                    <p class="pt-5 font-bold text-black dark:text-black">Opis: {kartica.description}</p>
                    <p class="pt-7 font-bold text-black dark:text-black">Broj proizvedenih modela: {kartica.modelnum}</p>
                </div>
              </div>
            );
        }else if (kartica.modelnum > 1000 && kartica.modelnum <= 9000) {
            return (
                <div class="content-center pb-8 pt-9 flex items-center justify-center">
                <div class="bg-gradient-to-r from-indigo-300 via-sky-500 to-emerald-500 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{kartica.model}, RARE</h5>
                    <p class="pt-5 font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                    <p class="pt-5 font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                    <p class="pt-5 font-bold text-black dark:text-black">Opis: {kartica.description}</p>
                    <p class="pt-7 font-bold text-black dark:text-black">Broj proizvedenih modela: {kartica.modelnum}</p>
                </div>
                </div>
            );
        } else if (kartica.modelnum <= 1000 && kartica.modelnum > 100) {
            return (
                <div class="content-center pb-8 pt-9 flex items-center justify-center">
                <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{kartica.model}, EPIC</h5>
                    <p class="pt-5 font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                    <p class="pt-5 font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                    <p class="pt-5 font-bold text-black dark:text-black">Opis: {kartica.description}</p>
                    <p class="pt-7 font-bold text-black dark:text-black">Broj proizvedenih modela: {kartica.modelnum}</p>
                </div>
                </div>
            );
        } else if (kartica.modelnum <= 100) {
            return (
                <div class="content-center pb-8 pt-9 flex items-center justify-center">
                <div class="bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{kartica.model}, LEGENDARY</h5>
                    <p class="pt-5  font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                    <p class="pt-5  font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                    <p  class="pt-5  font-bold text-black dark:text-black">Opis: {kartica.description}</p>
                    <p class="pt-7  font-bold text-black dark:text-black">Broj proizvedenih modela: {kartica.modelnum}</p>
                </div>
                </div>
            );
        }
     
    }
    const [kartice] =  createResource(dohvatiSve);
    console.log("karticas:",kartice);

    return(
        <>
      <div class="flex items-center space-x-8">
  <h1 class="font-mono text-4xl leading-tight flex items-center">Moj hangar</h1>
  <button
    class="mt-3 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
  >
    Filtriraj po rijedkosti
  </button>
</div>


    <For each={kartice()} fallback={<tr><td colspan="7" class="text-center py-4">Trenutno nema aviona</td></tr>}>
        {(kartica) => (
      GenerirajKarticu(kartica)
           )}
     </For>
     </>
    );

}
export default MojHangar;
