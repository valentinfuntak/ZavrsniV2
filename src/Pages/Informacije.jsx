import { useAuth } from "../Auth/AuthProvider.jsx";
import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

function Informacije(props) {
  const session = useAuth();
  const navigate = useNavigate();

  createEffect(() => {
    if (session() === null) {
      navigate("/AuthError");
    }
  });
  
  return (
    <div class="p-8">
      <h1 class="font-mono text-4xl mb-6">INFORMACIJE O APLIKACIJI</h1>

      <div class="space-y-6">
        <div>
          <p>
            Ova aplikacija koristi <a href="https://www.flightradar24.com/" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Flightradar24 API</a> za skeniranje neba i prikazivanje informacija o avionima u stvarnom vremenu. Korištenjem najnovijih podataka o letovima, omogućuje korisnicima praćenje avionskih ruta, visine, brzine i ostalih važnih parametara. Aplikacija omogućuje jednostavno pretraživanje i filtriranje letova na temelju različitih kriterija.
          </p>
        </div>

        <div>
          <p>
            <a href="https://solidjs.com/" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">SolidJS</a> je korišten za optimalne performanse aplikacije, dok su za dizajn korišteni <a href="https://tailwindcss.com/" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">TailwindCSS</a> i <a href="https://flowbite.com/" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Flowbite</a>, što omogućava moderni izgled i jednostavno korisničko iskustvo.
          </p>
        </div>

        <div>
          <p class="text-lg text-gray-300">
            Flightradar24 je jedan od najpoznatijih globalnih servisa za praćenje letova, a kroz našu aplikaciju, korisnici mogu uživati u brzom pristupu podacima o avionima koji lete u njihovoj blizini. Informacije o svakom letu uključuju podatke o tipu aviona, visini, poziciji, brzini leta i drugim detaljima.
          </p>
        </div>

        <div>
          <p class="text-lg text-gray-300">
            Aplikacija je dizajnirana uz pomoć SolidJS-a za optimalne performanse, dok su za dizajn korišteni TailwindCSS i Flowbite, što omogućava moderni izgled i jednostavno korisničko iskustvo.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Informacije;
