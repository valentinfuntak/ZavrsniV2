import { createSignal, onCleanup, onMount, Show } from "solid-js";


import { getFlightPositions } from '../Services/FlightRadarAPI.js';
import { getElevationData } from '../Services/ElevacijaAPI.js';
import { insertPlane } from '../Backend/supabaseClient.js';
import { azurirajTablicu } from "../Backend/supabaseClient.js";
import success from '../assets/bingo.mp3';
import fail from '../assets/fail.mp3';

import markerIcon from "../assets/marker-icon.png";
import markerShadow from "../assets/marker-shadow.png";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "../styles/kocka.css"

//import { getFlightInfo } from '../Services/OpenAIAPI';

//const url = import.meta.env.VITE_SUPABASE_URL;
//const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;
//const flightRadarKey = import.meta.env.FLIGHTRADAR_KEY;

//signali za BP i UI
export const [AzurirajBazu, setAzurirajBazu] = createSignal(false);
const [notifications, setNotifications] = createSignal([]);

//Signali za orijentaciju
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
const [snagaMagPolj, setSnagaMagPolj] = createSignal(0);

//Signali za kalkulacije
const [kutAvionaX, setKutAvionaX] = createSignal(0);
const [kutYAvion, setKutYAvion] = createSignal(0);
const [UdaljenostZRC, setUdaljenostZRC] = createSignal(0);
const [elevation, setElevation] = createSignal(0);
const [avionLng, setAvionLng] = createSignal(0);
const [avionLat, setAvionLat] = createSignal(0);
const [visina, setVisina] = createSignal(0);


//Signali za prikaz u formi
const [UdaljenosKuteva, setUdaljenostKuteva] = createSignal(0);
const [kutYPrikaz, setKutYPrikaz] = createSignal(0);
const [kutXPrikaz, setkutXPrikaz] = createSignal(0);
const [avionLatPrikaz, setAvionLatPrikaz] = createSignal(0);
const [avionLngPrikaz, setAvionLngPrikaz] = createSignal(0);
const [udaljenostPrikaz, setUdaljenostPrikaz] = createSignal(0);
const [brzina, setBrzina] = createSignal(0);
const [model, setModel] = createSignal(0);

let cubeRef;

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

const customMarker = new L.Icon({
  iconUrl: markerIcon,// Putanja do ikone u repozitoriju
  shadowUrl: markerShadow,
  iconSize: [25, 41], // Veličina originalne ikone
  iconAnchor: [12, 41], // Točka na ikoni koja se postavlja na lokaciju
  popupAnchor: [1, -34], // Gdje će se pojaviti popup
  shadowSize: [41, 41],
});

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
          mapInstance.setView([ latitude, longitude], 13);

          // Dodavanje markera za trenutnu lokaciju
          L.marker([latitude, longitude], { icon: customMarker })
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
  const orijentacijaUredjaja = () => {
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
  let notificationShown = false; 

  onMount(() => {
    let magSensor = new Magnetometer();
  
    magSensor.addEventListener("reading", (e) => {

      setSnagaMagPolj(Math.sqrt(Math.pow(magSensor.x, 2) + Math.pow(magSensor.y, 2) + Math.pow(magSensor.z, 2)));

      if (snagaMagPolj() > 65 || snagaMagPolj() < 20) {
        if (!notificationShown) {  
          showNotification(
            `Zbog snage magnetskog polja (${snagaMagPolj().toFixed(2)}µT), očitanja kuteva mogla bi biti neprecizna.`,
            "info",
            5000
          );
          notificationShown = true; 
        }
      } else {
        notificationShown = false;
      }
    });
  
    magSensor.start();

    showNotification("Kako bi ste koristili magnetometar, posjetite lokaciju chrome://flags ili edge://flags te dozvolite rad magnetometra!", "info", 10000);
  
    orijentacijaUredjaja();
    const mapContainer = document.getElementById("map-container");
    if (mapContainer) {
      initializeMap(mapContainer);
    }
    window.addEventListener("deviceorientation", handleOrientation);
  
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      magSensor.stop();
    };
  });
  //DEFINIRANJE ZRAČNOG PROSTORA U KOJEM SE TRAŽE AVIONI RADI
  //jedan stupanj lat (geo širina) je 111.11km / 60  = 1.85183333333km  u minuti broj 9.72009720099 * 1.85... daje okrug od 36km
  // jedan stupanj lng (geo visine) PRIBLIŽNO je 111*cos(lat)
 async function prozor(lat, lng) {
    setUdaljenostLatE(lat + 2.2 / 60);
    setUdaljenostLatW(lat - 2.2 / 60);

    const konstantaUdaljenostiLng = 2.2 / 60 * Math.cos(lat * Math.PI / 180)
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
  async function skeniranje(lat, lng, avionLa, avionLn, visina, beta, elevacija, smjer, model, brzina) {
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

    const gornjaGranicaY = kutYAvion() + 10;
    const donjaGranicaY = kutYAvion() - 10;
    const gornjaGranicaX = kutAvionaX() + 10;
    const donjaGranicaX = kutAvionaX() - 10;
    console.log("Gornja i donja granica kuta x:", gornjaGranicaX, donjaGranicaX);
    console.log("Gornja i donja granica kuta y:", gornjaGranicaY, donjaGranicaY);

    if (beta >= donjaGranicaY && beta <= gornjaGranicaY && smjer >= donjaGranicaX && smjer <= gornjaGranicaX) {
      var audio = document.getElementById("audiosuccess");
      audio.play();
  
      insertPlane(avionLa, avionLn, visina, brzina, call, model);
      await azurirajTablicu();
      
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

      let razlikaY = Math.min(Math.abs(kutYAvion()-beta), 360 - Math.abs(kutYAvion()-beta));
      let razlikaX = Math.min(Math.abs(kutAvionaX()-smjer), 360 - Math.abs(kutAvionaX()-smjer));
     
      let zbroj = razlikaY + razlikaX;
      
      if(UdaljenosKuteva() === null){
      setUdaljenostKuteva(zbroj);
      } else if (UdaljenosKuteva() < (zbroj)){
        setUdaljenostKuteva(zbroj);
        setKutYPrikaz(kutYAvion().toFixed(2));
        setkutXPrikaz(kutAvionaX().toFixed(2));
        setAvionLatPrikaz(avionLa.toFixed(2));
        setAvionLngPrikaz(avionLn.toFixed(2));
        setUdaljenostPrikaz(UdaljenostZRC().toFixed(2));
      } 
    }
    
  }

  const [loading, setLoading] = createSignal(false);

  const fetchFlightData = async () => {
    setLoading(true);
    try {
    const bounds = `${udaljenostLngN()},${udaljenostLngS()},${udaljenostLatW()},${udaljenostLatE()}`;
    const data = await getFlightPositions(bounds);

     if (data !== undefined) { 
        data.forEach(async (flight) => {
          const lat = flight.lat;
          const lon = flight.lon;
          const alt = (flight.alt / 3.28).toFixed(2); // Visina u metrima
          const brzina = Math.round(flight.brz * 1.852); // Brzina u km/h
          const modelA = flight.modelA;
          const call = flight.call;



          // Ažuriranje podataka na mapi
          setAvionLat(lat);
          setAvionLng(lon);
          setVisina(alt);
          setBrzina(brzina);
          setModel(modelA);

          L.marker([lat, lon], { icon: customMarker }).addTo(map())
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
            beta(),
            elevation(),
            magHeading(),
            modelA,
            brzina,
            call
          );
          console.log("Podaci o avionu:: ", flight);
        });
      }else{
        showNotification("Nema aviona u zračnom prostoru!", "error", 5000);
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
    await prozor(latitude(), longitude());
    await getElevation(latitude(), longitude());
    await fetchFlightData();
    console.log("Korisnikova lokacija: ", latitude(), longitude());
  }

  return (
    <>
      <div class="p-6  bg-gray-900 rounded-3xl">
        <h1 class="text-3xl font-bold text-center mb-6  text-white">PROGRAM</h1>
        <div class=" bg-gray-800 border  border-gray-700 rounded-lg shadow-lg p-6">
          <div class="flex justify-center items-center mb-4">
            <div
              id="map-container"
              class="w-full h-96  bg-gray-700 rounded-lg overflow-hidden border-4 border-gray-500"
            ></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class=" bg-gray-600 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <h2 class="text-lg font-semibold mb-2 text-white">Podaci o avionu</h2>
              <p class=" text-gray-300"><strong>Kut X do aviona: {kutXPrikaz()}°</strong></p>
              <p class="text-gray-300"><strong>Kut Y do aviona: {kutYPrikaz()}°</strong></p>
              <p class=" text-gray-300"><strong>Koordinate aviona: {avionLatPrikaz()}°, {avionLngPrikaz()}°</strong></p>
              <p class="text-gray-300"><strong>Zračna udaljenost: {udaljenostPrikaz()}m</strong></p>
              <p class="text-gray-300"><strong>Vaša Elevacija: {elevation()}m</strong></p>
            </div>

            <div class=" bg-gray-600 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <h2 class="text-lg font-semibold mb-2 text-white">Nagib uređaja</h2>
              <p class="text-gray-300"><strong>Alpha (Z os): {gamma().toFixed(2)}°</strong></p>
              <p class="text-gray-300"><strong>Beta (X os): {alpha().toFixed(2)}°</strong></p>
              <p class="text-gray-300"><strong>Gamma (Y os): {beta().toFixed(2)}°</strong></p>
              <p class="text-gray-300"><strong>Kut gledanja: {magHeading()} + 5.3°</strong></p>
            </div>

 
            {/* Proširena kocka unutar forme 
           <div class="bg-gray-600 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 col-span-1 md:col-span-2 flex justify-center items-center">
              <div class="cube-scene pt-16 w-full h-64"> 
                <div class="cube" ref={el => cubeRef = el}>
                  <div class="cube-face front">Front</div>
                  <div class="cube-face back">Back</div>
                  <div class="cube-face left">Left</div>
                  <div class="cube-face right">Right</div>
                  <div class="cube-face top">Top</div>
                  <div class="cube-face bottom">Bottom</div>
                </div>
              </div>
            </div> */}
          </div> 

          <div class="flex justify-center mt-6">
            <audio id="audiosuccess" src={success}></audio>
            <audio id="audiofail" src={fail}></audio>

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