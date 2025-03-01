//IZMJENIL SAM CREATEEFFECT

import { useAuth } from "../Auth/AuthProvider.jsx";
import { useNavigate, A } from "@solidjs/router";
import { createEffect, createSignal, Show, For } from "solid-js";

import { getPlanes, planes} from "../Backend/supabaseClient.js";

//import { fetchFlightInfo } from "../Components/Navigacija";
import Navigacija from "../Components/Navigacija.jsx";
import { konverzijaDatum } from "../Components/Navigacija.jsx";
//IZMJENA //import { userID } from "../Components/Navigacija.jsx";
import { showNotification } from "../Components/Navigacija.jsx";

import { getFlightInfo } from '../Services/OpenAIAPI';
import { getImgUrl } from "../Services/ImageScraperADSBDB.js";
import { spremiSliku } from "../Backend/supabaseClient";

function Program(props) {
    const session = useAuth();
    const navigate = useNavigate();

    const [isMobile, setIsMobile] = createSignal(window.innerWidth < 1024);

    createEffect(async() => {
        if (session() === null) {
            navigate("/AuthError");
        }
        await getPlanes(session().user.id);
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    });

        const fetchFlightInfo = async (model, AVreg) => {
        try {
          const informacijeAvion = await getFlightInfo(model);
          const slikaAvion = await getImgUrl(AVreg);
          await spremiSliku(model, slikaAvion, session().user.id);
          if (informacijeAvion !== null) {
            showNotification(`${informacijeAvion}`, "info", 20000);
          } else {
            console.log("OPEN AI API vratio je null vrijednost");
          }
        } catch (error) {
          console.error("Greška pri pokušaju dohvaćanja informacija: ", error);
        }
      }

    return (
        <>
            {isMobile() && <Navigacija />}
            <div class="mt-5 flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                <div>
                    <button id="dropdownRadioButton" data-dropdown-toggle="dropdownRadio" class="inline-flex items-center  border focus:outline-none  focus:ring-4  font-medium rounded-lg text-sm px-3 py-1.5 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700" type="button">
                        <svg class="w-3 h-3 text-gray-400 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                        </svg>
                        Last 30 days
                        <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <div id="dropdownRadio" class="z-10 hidden w-48 divide-y rounded-lg shadow bg-gray-700 divide-gray-600" data-popper-reference-hidden="" data-popper-escaped="" data-popper-placement="top" style="position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate3d(522.5px, 3847.5px, 0px);">
                        <ul class="p-3 space-y-1 text-sm  text-gray-200" aria-labelledby="dropdownRadioButton">
                            <li>
                                <div class="flex items-center p-2 rounded  hover:bg-gray-600">
                                    <input id="filter-radio-example-1" type="radio" value="" name="filter-radio" class="w-4 h-4 text-blue-600  focus:ring-blue-600 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600" />
                                    <label for="filter-radio-example-1" class="w-full ms-2 text-sm font-medium rounded text-gray-300">Last day</label>
                                </div>
                            </li>
                            <li>
                                <div class="flex items-center p-2 rounded  hover:bg-gray-600">
                                    <input checked="" id="filter-radio-example-2" type="radio" value="" name="filter-radio" class="w-4 h-4 text-blue-600    focus:ring-blue-600 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600" />
                                    <label for="filter-radio-example-2" class="w-full ms-2 text-sm font-medium  rounded text-gray-300">Last 7 days</label>
                                </div>
                            </li>
                            <li>
                                <div class="flex items-center p-2 rounded  hover:bg-gray-600">
                                    <input id="filter-radio-example-3" type="radio" value="" name="filter-radio" class="w-4 h-4 text-blue-600   focus:ring-blue-600 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600" />
                                    <label for="filter-radio-example-3" class="w-full ms-2 text-sm font-medium  rounded text-gray-300">Last 30 days</label>
                                </div>
                            </li>
                            <li>
                                <div class="flex items-center p-2 rounded  hover:bg-gray-600">
                                    <input id="filter-radio-example-4" type="radio" value="" name="filter-radio" class="w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600" />
                                    <label for="filter-radio-example-4" class="w-full ms-2 text-sm font-medium  rounded text-gray-300">Last month</label>
                                </div>
                            </li>
                            <li>
                                <div class="flex items-center p-2 rounded  hover:bg-gray-600">
                                    <input id="filter-radio-example-5" type="radio" value="" name="filter-radio" class="w-4 h-4 text-blue-600   focus:ring-blue-600 ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600" />
                                    <label for="filter-radio-example-5" class="w-full ms-2 text-sm font-medium rounded text-gray-300">Last year</label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <label for="table-search" class="sr-only">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-5 h-5  text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                    </div>
                    <input type="text" id="table-search" class="block p-2 ps-10 text-sm text-gray-900 border rounded-lg w-80   bg-gray-700 border-gray-600 placeholder-gray-400 :text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Search for items" />
                </div>
            </div>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 border-2  border-gray-600">
                <table class="w-full text-sm text-left rtl:text-right  text-gray-400">
                    <caption class="p-5 text-lg font-semibold text-left rtl:text-right   text-white bg-gray-800">
                        Prikaz pronađenih zrakoplova
                        <p class="mt-1 text-sm font-normal text-gray-400">
                            Ovdje možete detaljnije pregledati informacije o zrakoplovima koje ste pronašli.
                        </p>
                    </caption>
                    <thead class="text-xs uppercase bg-gray-700 text-white">
                        <tr>
                            <th scope="col" class="px-6 py-3">ID</th>
                            <th scope="col" class="px-6 py-3">Model</th>
                            <th scope="col" class="px-6 py-3">Vrijeme</th>
                            <th scope="col" class="px-6 py-3">Latituda</th>
                            <th scope="col" class="px-6 py-3">Longituda</th>
                            <th scope="col" class="px-6 py-3">Altituda (m)</th>
                            <th scope="col" class="px-6 py-3">Brzina (km/h)</th>
                            <th scope="col" class="px-6 py-3">Više informacija</th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={planes()} fallback={<tr><td colspan="7" class="text-center py-4">Trenutno nema aviona</td></tr>}>
                            {(plane) => (
                                <tr class=" odd:bg-gray-900  even:bg-gray-800 border-b border-gray-700">
                                    <td class="px-6 py-4 font-medium  text-white">{plane.id}</td>
                                    <td class="px-6 py-4">{plane.model}</td>
                                    <td class="px-6 py-4">{konverzijaDatum(plane.time)}</td>
                                    <td class="px-6 py-4">{plane.latitude}</td>
                                    <td class="px-6 py-4">{plane.longitude}</td>
                                    <td class="px-6 py-4">{plane.altitude}</td>
                                    <td class="px-6 py-4">{plane.speed}</td>
                                    {<td class="px-6 py-4">
                                        <Show when={plane.description === null} fallback={<div class="flex justify-center items-center"> <a href="/MojHangar"><svg class="w-6 h-6 text-yellow-400 dark:text-yellow-400 hover:text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"/>
</svg>
</a>
</div>
}>
                                        <button class="bg-yellow-600 text-white font-semibold py-2 px-4 w-full rounded-lg shadow-md hover:bg-yellow-500 transition duration-200" onClick={() => fetchFlightInfo(plane.model, String(plane.registration))}>
                                            Prouči
                                        </button>
                                        </Show>
                                    </td>}
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>

            </div>
            <div class="pt-8 mt-10 font-semibold text-xl hover:text-yellow-500">
            <A href="/mojHangar">Kako bi vidjeli sve pronađene zrakoplove, posjetite Moj Hangar!</A>
            </div>

        </>

    );
}

export default Program;
