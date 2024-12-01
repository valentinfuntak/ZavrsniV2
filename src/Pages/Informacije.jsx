import { createSignal } from "solid-js";

function Informacije(props) {
  return (
    <div class="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg max-w-4xl mx-auto dark:text-white border-4 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-all">
      <h1 class="font-inter text-4xl font-semibold mb-4">INFORMACIJE O APLIKACIJI</h1>
      <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">
        Ova aplikacija koristi <a href="https://www.flightradar24.com/" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Flightradar24 API</a> za skeniranje neba i prikazivanje informacija o avionima u stvarnom vremenu. Korištenjem najnovijih podataka o letovima, omogućuje korisnicima praćenje avionskih ruta, visine, brzine i ostalih važnih parametara. Aplikacija omogućuje jednostavno pretraživanje i filtriranje letova na temelju različitih kriterija.
      </p>
      <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">
        <a href="https://solidjs.com/" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">SolidJS</a> je korišten za optimalne performanse aplikacije, dok su za dizajn korišteni <a href="https://tailwindcss.com/" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">TailwindCSS</a> i <a href="https://flowbite.com/" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Flowbite</a>, što omogućava moderni izgled i jednostavno korisničko iskustvo.
      </p>
      <p class="text-lg text-gray-700 dark:text-gray-300">
        Flightradar24 je jedan od najpoznatijih globalnih servisa za praćenje letova, a kroz našu aplikaciju, korisnici mogu uživati u brzom pristupu podacima o avionima koji lete u njihovoj blizini ili bilo kojem dijelu svijeta. Informacije o svakom letu uključuju podatke o tipu aviona, vremenu polijetanja, odredištu, brzini leta i drugim detaljima koji mogu biti korisni za ljubitelje avijacije ili putnike.
      </p>
      <p class="text-lg text-gray-700 dark:text-gray-300">
        Aplikacija je dizajnirana uz pomoć SolidJS-a za optimalne performanse, dok su za dizajn korišteni TailwindCSS i Flowbite, što omogućava moderni izgled i jednostavno korisničko iskustvo.
      </p>
    </div>
  );
}

export default Informacije;
