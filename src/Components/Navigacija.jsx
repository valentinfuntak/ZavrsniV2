import { createSignal, onCleanup, onMount, Show } from "solid-js";


import { getFlightPositions } from '../Services/FlightRadarAPI.js';
import { getElevationData } from '../Services/ElevacijaAPI.js';
import { insertPlane } from '../Backend/supabaseClient.js';

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/kocka.css"
import supabase from '../Backend/supabaseClient.js';
//import { getFlightInfo } from '../Services/OpenAIAPI';

//const url = import.meta.env.VITE_SUPABASE_URL;
//const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;
//const flightRadarKey = import.meta.env.FLIGHTRADAR_KEY;

export const [AzurirajBazu, setAzurirajBazu] = createSignal(false);
const [notifications, setNotifications] = createSignal([]);

const [latitude, setLatitude] = createSignal(null);
const [longitude, setLongitude] = createSignal(null);
const [alpha, setAlpha] = createSignal(0);
const [beta, setBeta] = createSignal(0);
const [gamma, setGamma] = createSignal(0);
const [magHeading, setMagHeading] = createSignal(null);
const [udaljenostLatE, setUdaljenostLatE] = createSignal(null);
const [udaljenostLatW, setUdaljenostLatW] = createSignal(null);
const [udaljenostLngN, setUdaljenostLngN] = createSignal(null);
const [udaljenostLngS, setUdaljenostLngS] = createSignal(null);
const [kutAvionaX, setKutAvionaX] = createSignal(0);
const [kutYAvion, setKutYAvion] = createSignal(0);
const [UdaljenostZRC, setUdaljenostZRC] = createSignal(0);
const [elevation, setElevation] = createSignal(0);
const [avionLng, setAvionLng] = createSignal(0);
const [avionLat, setAvionLat] = createSignal(0);
const [visina, setVisina] = createSignal(0);
const [brzina, setBrzina] = createSignal(0);
const [model, setModel] = createSignal(0);
export const [InformacijeIspis, setInformacijeIspis] = createSignal(null);

let cubeRef;
let mapContainer;

export function konverzijaDatum(vrijeme){
  const date = new Date(vrijeme);
  const formatirano = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
  
  return formatirano;
  }

    /*OPEN AI API
  export const fetchFlightInfo = async () => {
    try {
      const informacijeAvion = await getFlightInfo(modelZrakoplova);
      if (informacijeAvion !== null) {
        setInformacijeIspis(informacijeAvion);

        //STVORITI NOVI PROZOR U KOJEM SE PRIKAZUJE INFORMACIJA

        
      } else {
        console.log("OPEN AI API vratio je null vrijednost");
      }
    } catch (error) {
      console.error("Greška pri pokušaju dohvaćanja informacija: ", error);
    }
  }
    */

export async function showNotification(message, type, trajanje) {
  const newNotification = { message, type };
  setNotifications((prev) => [...prev, newNotification]);

  setTimeout(() => {
    setNotifications((prev) => prev.filter((n) => n !== newNotification));
  }, trajanje);
}

export async function pokreniAzuriranje(Azuriraj) {
  if (Azuriraj === false) {
    setAzurirajBazu(true);
  }
}

export default function KomponentaProgram(props) {
  const [map, setMap] = createSignal(null);

  //MAPA
  const initializeMap = (mapContainer) => {
    // Kreiramo instancu mape
    const mapInstance = L.map(mapContainer, {
      zoomControl: false, // Uklanjanje kontrole za zoom
      attributionControl: false, // Uklanjanje atribucije
    }).setView([51.505, -0.09], 13); // Postavite početnu poziciju i zoom

    // MAKNUTI
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapInstance);

    // Provjera da li preglednik podržava geolokaciju
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Centriranje mape na trenutnu lokaciju
          mapInstance.setView([latitude, longitude], 13);

          // Dodavanje markera za trenutnu lokaciju
          L.marker([latitude, longitude])
            .addTo(mapInstance)
            .bindPopup("Vaša trenutna lokacija")
            .openPopup();
        },
        (error) => {
          // Ako se geolokacija ne može dobiti, ispisuje grešku
          console.error("Geolokacija nije dostupna: ", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // Postavljanje vremenskog ograničenja za dobivanje lokacije
          maximumAge: 0, // Ne koristi staru lokaciju
        }
      );
    } else {
      console.error("Geolokacija nije podržana u ovom pregledniku");
    }

    setMap(mapInstance);
  };

  // Čistimo mapu kada se komponenta ukloni
  onCleanup(() => {
    if (map()) {
      map().remove();
    }
  });

  //KOMPAS
  const magnetometar = () => {
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientationabsolute", (event) => {
              if (event.alpha !== null) {
                let heading = event.alpha; 
                if (heading < 0) heading += 360;
                heading = heading.toFixed(2);
                if (Math.abs(beta) < 45 && Math.abs(gamma) < 45) {
                  setMagHeading(alpha); 
                } else {
                  
                  console.log("Ignoring alpha changes due to significant tilt.");
                }
              } else {
                showNotification("Magnetic heading is not available", "error", 5000);
              }
            });
          } else {
            showNotification("Permission denied for device orientation", "error", 5000);
          }
        })
        .catch((err) => {
          console.error("Error requesting device orientation permission:", err);
          showNotification("Device orientation permission error", "error", 5000);
        });
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientationabsolute", (event) => {
        if (event.alpha !== null) {
          let smjer = event.alpha;
          let gore = event.beta;    
          let dubina = event.gamma;

          
          const deklinacija = 5.3; //Vrijedi samo za KC :( 
          smjer = (smjer + 360) % 360;

          if (smjer < 0){
            smjer += 360;
          }
          if(smjer > 0 && smjer < 180){
            smjer = 360 - smjer;
          } else if(smjer > 0 && smjer > 180){
            smjer = 360 - smjer;
          }
          
          smjer = smjer.toFixed(2); 

          if (Math.abs(gore) < 45 && Math.abs(dubina) < 45) {
            setMagHeading(smjer); 
          }

        } else {
          showNotification("Nismo u mogućnosti pronaći Vašu orijentaciju.", "error", 5000);
        }
      });
    } else {
      showNotification("DeviceOrientation nije podržan.", "error", 5000);
    }
  };

  async function IzracunajKutX(latKorisnik, lngKorisnik, latAvion, lngAvion){
    let bearing = Math.atan2(latAvion - latKorisnik, lngAvion-lngKorisnik);
    bearing = (bearing * (180/Math.PI) + 360) % 360;
    console.log("bearing je: ", bearing);

    setKutAvionaX(bearing);

  }

  //DOBIVANJE LAT I LNG KORISNIKA RADI
  function lokacijaKorisnik() {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLatitude(lat);
            setLongitude(lng);
            console.log("LATITUDA I LONGITUDA KORISNIK: ", latitude(), longitude());
            resolve();
          },
          (error) => {
            console.error("Error fetching geolocation:", error);
            reject(error);
          }
        );
      } else {
        console.log("Geolocation is not supported");
      }
    });
  }

  //ORIJENTACIJA MOBITELA
  const handleOrientation = (event) => {
    setAlpha(event.alpha);
    setBeta(event.beta);
    setGamma(event.gamma);

    if (cubeRef) {
      cubeRef.style.transform = `rotateX(${beta()}deg) rotateY(${gamma()}deg) rotateZ(${alpha()}deg)`;
    }
  };

  // POKRETANJE MAGNETOMETAR, UCITAVANJE PODATAKA IZ DB, ORIJENTACIJA I MAPA RADI
  onMount(() => {
    showNotification("Kako bi ste koristili magnetometar, posjetite lokaciju chrome://flags ili edge://flags te dozvolite rad magnetometra!", "info", 10000);
    magnetometar();
    const mapContainer = document.getElementById("map-container");
    if (mapContainer) {
      initializeMap(mapContainer);
    }
    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  });

  //DEFINIRANJE ZRAČNOG PROSTORA U KOJEM SE TRAŽE AVIONI RADI
  //jedan stupanj lat (geo širina) je 111.11km / 60  = 1.85183333333km  u minuti broj 9.72009720099 * 1.85... daje okrug od 36km
  // jedan stupanj lng (geo visine) PRIBLIŽNO je 111*cos(lat)
  function prozor(lat, lng) {
    setUdaljenostLatE(lat + 9.72009720099 / 60);
    setUdaljenostLatW(lat - 9.72009720099 / 60);

    const konstantaUdaljenostiLng = 9.72009720099 / 60 * Math.cos(lat * Math.PI / 180)
    setUdaljenostLngN(lng + konstantaUdaljenostiLng);
    setUdaljenostLngS(lng - konstantaUdaljenostiLng);

    console.log("Okvir gledanja", udaljenostLatE(), udaljenostLatW(), udaljenostLngN(), udaljenostLngS());
  }      

  // API ELEVACIJA open-meto
  async function getElevation(lat, lng) {
    try {
      const elevationData = await getElevationData(lat, lng);
      if (elevationData !== null) {
        setElevation(elevationData);
      } else {
        console.log("API za elevaciju vratio je null vrijednost");
      }
    } catch (error) {
      console.error("Greška pri pokušaju dohvaćanja elevacije: ", error);
    }
  }

  //IZRAČUN ZRAČNE UDALJENOSTI, KUTA Y AVIONA I MEĐA ZA IDENTIFIKACIJU AVIONA
  async function skeniranje(lat, lng, avionLa, avionLn, visina, gamma, elevacija) {
    const R = 6371000;
    const X1 = avionLa * (Math.PI / 180);
    const Y1 = avionLn * (Math.PI / 180);
    const X2 = lat * (Math.PI / 180);
    const Y2 = lng * (Math.PI / 180);

    const dlat = X2 - X1;
    const dlon = Y2 - Y1;

    const a = Math.sin(dlat / 2) ** 2 + Math.cos(X1) * Math.cos(X2) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));
    const UdaljenostZRCVal = R * c;

    if (UdaljenostZRCVal != 0) {
      setUdaljenostZRC(UdaljenostZRCVal);
    } else if (UdaljenostZRCVal === null) {
      console.log("UdaljenostZRC je null, provjeriti funkciju skeniranje")
    } else {
      setUdaljenostZRC(visina);
    }
    const VisinaDelta = visina - elevacija;

    const kutAvionYValue = Math.atan(UdaljenostZRC() / VisinaDelta) * (180 / Math.PI);
    console.log("ZRACNA UDALJENOST JE:", UdaljenostZRC());
    console.log("KUT Y JE", kutAvionYValue);
    console.log("VISINA JE:", visina);
    setKutYAvion(kutAvionYValue);
    IzracunajKutX(latitude(), longitude(), avionLat(), avionLng());

    const gornjaGranicaY = kutYAvion() + 5;
    const donjaGranicaY = kutYAvion() - 5;
    const gornjaGranicaX = kutAvionaX() + 5;
    const donjaGranicaX = kutAvionaX() - 5;
    console.log("Gornja i donja granica kuta x:", gornjaGranicaX, donjaGranicaX);
    console.log("Gornja i donja granica kuta y:", gornjaGranicaY, donjaGranicaY);

    if (gamma >= donjaGranicaY && gamma <= gornjaGranicaY && magHeading() >= donjaGranicaX && magHeading() <= gornjaGranicaX) {
      var audio = document.getElementById("audiosuccess");
      audio.play();
      
      //OVO ODKOMENTIRAT NAKON KUPNJE API-a
      //insertPlane(lat, lon, alt, brzina, call, modelA);
      
      if (error) {
        console.error('Greška pri spremanju podataka u bazu:', error.message);
      } else {
        console.log('Podaci spremljeni u bazu');
      }

      if (error) {
        console.log(error, "Greška prilikom slanja u BP");
      }
    } else {
      var audio = document.getElementById("audiofail");
      audio.play();
      showNotification("Avion se ne nalazi u traženom zračnom prostoru", "error", 5000);
    }
  }

  const [loading, setLoading] = createSignal(false);
  const apiToken = '${flightRadarKey}';

  const fetchFlightData = async () => {
    setLoading(true);
    try {
      const bounds = '50.682,46.218,14.422,22.243';
      const data = await getFlightPositions(apiToken, bounds);

      if (data !== null) {
        data.forEach(async (flight) => {
          const lat = flight.lat;
          const lon = flight.lon;
          const alt = (flight.alt / 3.28).toFixed(2); // Visina u metrima
          const brzina = Math.round(flight.brz * 1.852); // Brzina u km/h
          const modelA = flight.modelA;
          const call = flight.call;

          insertPlane(lat, lon, alt, brzina, call, modelA);

          // Ažuriranje podataka na mapi
          setAvionLat(lat);
          setAvionLng(lon);
          setVisina(alt);
          setBrzina(brzina);
          setModel(modelA);

          L.marker([lat, lon]).addTo(map())
            .bindPopup(`
            <div class="text-xs p-2 max-w-xs">
              <strong>Let:</strong> ${call}<br>
              <strong>Zrakoplov:</strong> ${modelA}<br>
              <strong>Altituda:</strong> ${alt} m
            </div>  `)
            .openPopup();

          skeniranje(
            latitude(),
            longitude(),
            lat,
            lon,
            alt,
            gamma(),
            elevation()
          );
          console.log("Podaci o avionu:: ", flight);
        });
      }
    } catch (error) {
      console.error('Failed to fetch flight data:', error);
    } finally {
      setLoading(false);
    }
  };

 
  //POKRECE SVE RADI
  async function pokretac() {
    await lokacijaKorisnik();
    prozor(latitude(), longitude());
    await getElevation(latitude(), longitude());
    await fetchFlightData();
    console.log("Korisnikova lokacija: ", latitude(), longitude());
  }

  return (
    <>
      <div class="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl">
        <h1 class="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">PROGRAM</h1>
        <div class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-6">
          <div class="flex justify-center items-center mb-4">
            <div
              id="map-container"
              class="w-full h-96 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden border-4 border-gray-500"
            ></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-100 dark:bg-gray-600 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <h2 class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Podaci o avionu</h2>
              <p class="text-gray-700 dark:text-gray-300"><strong>Kut X između korisnika i aviona: {kutAvionaX()}°</strong></p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Kut Y do aviona: {kutYAvion()}°</strong></p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Koordinate aviona: {avionLat()}°, {avionLng()}°</strong></p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Visina aviona: {visina()}m</strong></p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Elevacija: {elevation()}m</strong></p>
            </div>

            <div class="bg-gray-100 dark:bg-gray-600 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <h2 class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Nagib uređaja</h2>
              <p class="text-gray-700 dark:text-gray-300"><strong>Alpha (Z os): {gamma().toFixed(2)}°</strong></p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Beta (X os): {alpha().toFixed(2)}°</strong></p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Gamma (Y os): {beta().toFixed(2)}°</strong></p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Kut gledanja: {magHeading()} + 5.3°</strong></p>
            </div>

            {/* Proširena kocka unutar forme */}
            <div class="bg-gray-100 dark:bg-gray-600 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 col-span-1 md:col-span-2 flex justify-center items-center">
              <div class="cube-scene pt-16 w-full h-64"> {/* Povećan prostor za kocku */}
                <div class="cube" ref={el => cubeRef = el}>
                  <div class="cube-face front">Front</div>
                  <div class="cube-face back">Back</div>
                  <div class="cube-face left">Left</div>
                  <div class="cube-face right">Right</div>
                  <div class="cube-face top">Top</div>
                  <div class="cube-face bottom">Bottom</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center mt-6">
            <audio id="audiosuccess" src="src/assets/bingo.mp3"></audio>
            <audio id="audiofail" src="src/assets/fail.mp3"></audio>

            <button
              onClick={pokretac}
              class="bg-blue-600 text-white font-semibold py-2 px-4 w-full rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
            >
              Skeniraj
            </button>
          </div>

          <div class="top-16 mt-2 col-span-1 md:col-span-2 flex justify-start w-full">
            <div class="space-y-2 w-full">
              {notifications().map((notification, index) => (
                <div
                  key={index}
                  class={`p-4 rounded ${notification.type === "error" ? "bg-red-600" :
                    notification.type === "success" ? "bg-green-700" :
                      notification.type === "info" ? "bg-blue-400" : ""} text-white shadow-md`}
                >
                  <div class="whitespace-normal w-full">
                    {notification.message}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}