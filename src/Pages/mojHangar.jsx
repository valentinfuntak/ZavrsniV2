import { useAuth } from "../Auth/AuthProvider.jsx";
import { useNavigate } from "@solidjs/router";
import { createEffect, createResource, onMount } from "solid-js";
import { dohvatiSve } from "../Backend/supabaseClient.js";
import { konverzijaDatum, userID } from "../Components/Navigacija.jsx";

function MojHangar(props) {
    const session = useAuth();
    const navigate = useNavigate();

    //console.log(session());

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

    function pretraga(){
        const unos = document.querySelector("#search-input");
        const filter = unos.value.toLowerCase();
        const prikazi = document.querySelectorAll(".custom-card");
    
        prikazi.forEach((item) =>{
        let text = item.querySelector("#naslov").textContent;
        if(text.toLowerCase().includes(filter.toLowerCase())){
            item.style.display = ``;
        } else{
            item.style.display = `none`;
        }
        });
        }


        function GenerirajKarticu(kartica){
            if (kartica.modelnum === null) {
                 return (
                     <div class="custom-card content-center pb-8 pt-9 flex items-center justify-center">
                     <div class="bg-gradient-to-r from-slate-200 to-stone-400 block max-w-sm p-6 bg-white border border-white-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                         <h5 id="naslov" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{kartica.model}, ???</h5>
                         <p class="pt-5 font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                         <p class="pt-5 font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                         <p class="pt-5 font-bold text-black dark:text-black">Opis: Nije istraženo!</p>
                         <p class="pt-7 font-bold text-black dark:text-black">Broj proizvedenih modela: Nije istraženo!</p>
                     </div>
                     </div>
                 );
             } else if (kartica.modelnum > 9000) {
                 return (
                     <div class="custom-card content-center pb-8 pt-9 flex items-center justify-center">
                     <div class="bg-gradient-to-r from-red-200 via-fushia-300 to-rose-500 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                         <h5 id="naslov" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{kartica.model}, COMMON</h5>
                         <p class="pt-5 font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                         <p class="pt-5 font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                         <p class="pt-5 font-bold text-black dark:text-black">Opis: {kartica.description}</p>
                         <p class="pt-7 font-bold text-black dark:text-black">Broj proizvedenih modela: {kartica.modelnum}</p>
                     </div>
                   </div>
                 );
             }else if (kartica.modelnum > 1000 && kartica.modelnum <= 9000) {
                 return (
                     <div class="custom-card content-center pb-8 pt-9 flex items-center justify-center">
                     <div class="bg-gradient-to-r from-indigo-300 via-sky-500 to-emerald-500 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                         <h5 id="naslov" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{kartica.model}, RARE</h5>
                         <p class="pt-5 font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                         <p class="pt-5 font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                         <p class="pt-5 font-bold text-black dark:text-black">Opis: {kartica.description}</p>
                         <p class="pt-7 font-bold text-black dark:text-black">Broj proizvedenih modela: {kartica.modelnum}</p>
                     </div>
                     </div>
                 );
             } else if (kartica.modelnum <= 1000 && kartica.modelnum > 100) {
                 return (
                     <div class="custom-card content-center pb-8 pt-9 flex items-center justify-center">
                     <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                         <h5 id="naslov" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{kartica.model}, EPIC</h5>
                         <p class="pt-5 font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                         <p class="pt-5 font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                         <p class="pt-5 font-bold text-black dark:text-black">Opis: {kartica.description}</p>
                         <p class="pt-7 font-bold text-black dark:text-black">Broj proizvedenih modela: {kartica.modelnum}</p>
                     </div>
                     </div>
                 );
             } else if (kartica.modelnum <= 100) {
                 return (
                     <div class="custom-card content-center pb-8 pt-9 flex items-center justify-center">
                     <div class="bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                         <h5 id="naslov" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{kartica.model}, LEGENDARY</h5>
                         <p class="pt-5  font-bold text-black dark:text-black">Pronađen: {konverzijaDatum(kartica.time)}h</p>
                         <p class="pt-5  font-bold text-black dark:text-black">Brzina i visina: {kartica.speed}km/h, {kartica.altitude}m</p>
                         <p  class="pt-5  font-bold text-black dark:text-black">Opis: {kartica.description}</p>
                         <p class="pt-7  font-bold text-black dark:text-black">Broj proizvedenih modela: {kartica.modelnum}</p>
                     </div>
                     </div>
                 );
             }
          
         }
    const [kartice] =  createResource(userID, dohvatiSve);
    return(
        <>
     <div class="flex flex-row  justify-center items-center  space-x-8 flex-col md:flex-row">
  <h1 class="font-mono text-4xl leading-tight flex items-center min-w-20">Moj hangar</h1>
  <input type="text" class="form-control text-black bg-slate-200 rounded  md:w-60 w-60 h-8 mt-3 pl-3" autocomplete="off" id="search-input" placeholder="Pretraži..."/>
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
