import AuthProvider from '@auth/AuthProvider.jsx';
import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js"; 

function Upute(props) {
    const session = useAuth();
    const navigate = useNavigate();

    createEffect(() => {
        if (session() === null) {
            navigate("/AuthError");
        }
    });

    return (
        <div class="p-8">
            <h1 class="font-mono text-4xl mb-12">Upute za korištenje</h1>
            <div>
                    <h2 class="text-2xl text-yellow-600 font-semibold mb-8">Korištenje karte</h2>
                    <p class="font-semibold mb-10">
                        Kartu možete koristiti kako bi se mogli što lakše pozicionirali.<br></br>
                        Karta će uvjek prikazati vaš trenutačni položaj.<br></br>
                        Karta se može povećati i smanjiti gestikuliranjem.<br></br>
                        Nakon pritiska na gumb "Skeniraj", na karti će se prikazati svi avioni<br></br>
                        u okrugu od 30km.<br></br>
                    </p>
                </div>

                <div>
                    <h2 class="text-2xl text-yellow-600 font-semibold mb-8">Alati za orijentaciju</h2>
                    <p class="font-semibold mb-10">
                        U kućici pod nazivom "Nagib uređaja" možete vidjeti podatke o svojoj orijentaciji.<br></br>
                        Ovi podaci mogu Vam biti od koristi prilikom ciljanja zrakoplova.<br></br>
                        Postoje 3 osi, svaka od kojih ima svoj naziv te se njezin kut mjeri u stupnjevima.<br></br>
                        Os Alpha mjeri pomak u dubinu, os Beta kružno horizontalno gibanje, a os Gamma vertikalno gibanje.<br></br>
                        Kut gledanja označuje vaš smjer promatranja s obzirom na magnetski sjever.<br></br>
                        Kut gledanja također sadrži dodatak, zbroj dodatka i smjera u stupnjevima udaljenost je od stvarnog sjevera.<br></br>
                    </p>
                </div>

                <div>
                    <h2 class="text-2xl text-yellow-600 font-semibold mb-8">Podaci o avionu</h2>
                    <p class="font-semibold mb-10">
                        U kućici pod nazivom "Podaci o avionu" možete pronaći podatke o najbližem zrakoplov.<br></br>
                        Vrijednosti ovih polja popunjavaju se kada korisnik ne pronađe zrakoplov<br></br>
                        nakon pritiska na gumb "Skeniraj".<br></br>
                        Ovdje možete pronaći podatke koji će vam pomoći da pronađete najbliži zrakoplov.<br></br>
                        Podaci uključuju: koordinate zrakoplova, Vašu elevaciju, zračnu udaljenost te pogodbene kuteve.<br></br>
                        Pogodbeni kutevi "Kut X do aviona" i "Kut Y do aviona" moraju biti identični<br></br>
                        Vašem smjeru (zajedno sa dodatkom) te kutu Gamma.<br></br>
                        Tolerancija oba kuta je +/- 5°.<br></br>
                    </p>
                </div>

                <div>
                    <h2 class="text-2xl text-yellow-600 font-semibold mb-8">Tablični prikaz</h2>
                    <p class="font-semibold mb-10">
                        U tabličnom prikazu pojavit će se informacije o zadnjih 5 pronađenih zrakoplova.<br></br>
                        Tabličan prikaz nudi pregled dodatnih činjenica o samom zrakoplovu.<br></br>
                        Pritiskom na gumb "Prouči" pokrenut ćete AI asistenta koji će Vas<br></br>
                        dodatno informirati o samom zrakoplovu.<br></br>
                    </p>
                </div>

                <div>
                    <h2 class="text-2xl text-yellow-600 font-semibold mb-8">Česte notifikacije</h2>
                    <p class="font-semibold mb-10">
                        1) "Nismo u mogućnosti pronaći Vašu orijentaciju" ili "DeviceOrientation nije podržan":<br></br>
                        Vaš uređaj nažalost nije u mogućnosti prikupiti orijentaciju.<br></br>
                        2) "Avion se ne nalazi u traženom zračnom prostoru":<br></br>
                        Uređaj nije pravilno usmjeren prema zrakoplovu.<br></br>
                        3) "Greška pri slanju e-maila za resetiranje lozinke":<br></br>
                        Nažalost nismo u mogućnosti proslijediti e-mail, pokušajte ponovo kasnije<br></br>
                    </p>
                </div>

                <h2 class="text-xl text-yellow-600 font-semibold mb-5">Želite nam postaviti pitanje?</h2>
                <p class="font-semibold mb-10">
                        Posjetite stranicu "kontakt" i kontaktirajte nas kako bi odgovorili na Vaše pitanje!<br></br>
                        Kontaktirati nas možete putem naših mail adresa.<br></br>
                        Unaprijed zahvaljujemo na strpljenju!<br></br>
                    </p>
</div>
    );
}

export default Upute;
