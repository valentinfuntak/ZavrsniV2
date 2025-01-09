//SLozeno magHeading i magnetometar funkciju --> treba ukljuciti flags sa chrome://flags ili edge://flags


//Popravit kocku css
//Slozit prijavu
//Slozit edge funkciju za flightradar


import { createSignal, onCleanup, onMount } from "solid-js";
import { getFlightPositions } from '../Services/FlightRadarAPI';
import { getElevationData } from '../Services/ElevacijaAPI';

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/kocka.css"
import supabase from '../Backend/supabaseClient';

const url = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;
const flightRadarKey = import.meta.env.FLIGHTRADAR_KEY;

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

let cubeRef;
let mapContainer;

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

  //provjeriti stupce, ubaciti u tablicu data.time, data.latitude... DODATI U CLIENT POD OPCIJE ZA FILTER
  async function ucitajPodatke() {
    const { data, error } = await supabase
      .from('AvioniNadjeno')
      .select()
      .order('id', { ascending: false })
      .limit(5);

    if (error) {
      console.error("Greška prilikom dohvacanja podataka iz baze:", error);
      return null;
    }
  }

  //KUT X S OBZIROM NA MAGNETSKI SJEVER KORISNIK RADI
  const magnetometar = () => {
    if ("Magnetometer" in window) {
      const sensor = new Magnetometer();
      sensor.start();
      sensor.onreading = () => {
        sensor.onreading = () => {
          let kut = Math.atan2(sensor.x, sensor.y) * (180 / Math.PI);
          if (kut < 0) {
            kut += 360;
          }
          const declination = 0;
          kut += declination;
          if (kut >= 360) kut -= 360;
          kut = kut.toFixed(2);
          setMagHeading(kut);
        };
      };
      onCleanup(() => {
        sensor.stop();
      });
    } else {
      alert("Nije podržan magnetometar!");
    }
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
    alert("Kako bi ste koristili magnetometar, posjetite lokaciju chrome://flags ili edge://flags te dozvolite rad magnetometra!")
    magnetometar();
    ucitajPodatke();
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

  // KUT X IZMEĐU KORISNIKA I AVIONA, KUTY NIJE KUTYAVIONA!!! RADI?
  //daje vrijednosti od 0-360
  function kutKor_AV(avionLat, avionLng, lat, lng) {
    const kutY = Math.atan2(avionLat - lat, avionLng - lng) * (180 / Math.PI);
    const kutAvionaX = (90 - kutY + 360) % 360;
    setKutAvionaX(kutAvionaX);
    console.log(kutAvionaX());
  }
/*
  // API ELEVACIJA 
  async function getElevation(lat, lng) {
    const dataset = "etopo1";
      try{
        const data = await getElevationData(dataset, lat, lng);
        const elevation = data.results[0]?.elevation;
        if (data !== null) {
          setElevation(elevation);
        } else{
          console.log("API za elevaciju vratio je null vrijednost");
        }
      }catch (error){
        console.error("Greška pri pokušaju dohvaćanja elevacije: ", error);
      }
    }
      */

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
  async function skeniranje(lat, lng, avionLat, avionLng, visina, gamma, elevacija) {
    const R = 6371000;
    const X1 = avionLat * (Math.PI / 180);
    const Y1 = avionLng * (Math.PI / 180);
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
    setKutYAvion(kutAvionYValue);
    kutKor_AV(avionLat(), avionLng(), latitude(), longitude());

    gornjaGranicaY = kutYAvion() + 5;
    donjaGranicaY = kutYAvion() - 5;
    gornjaGranicaX = kutAvionaX() + 5;
    donjaGranicaX = kutAvionaX() - 5;
    console.log("Gornja i donja granica kuta x:", gornjaGranicaX, donjaGranicaX);
    console.log("Gornja i donja granica kuta y:", gornjaGranicaY, donjaGranicaY);

    if (gamma() >= donjaGranicaY && gamma() <= gornjaGranicaY && magHeading() >= donjaGranicaX && magHeading() <= gornjaGranicaX) {
      var audio = document.getElementById("audiosuccess");
      audio.play();

      let now = new Date();
      let vrijeme = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      //Dodavanje aviona u bazu (id je samonumeriranje)
      const { error } = await supabase
        .from('AvioniNadjeno') //ime tablice
        .insert({ model: model(), time: vrijeme, latitude: avionLat(), longitude: avionLng(), altitude: visina(), speed: brzina() })
      if (error) {
        console.log(error, "Greška prilikom slanja u BP");
      }
    } else {
      var audio = document.getElementById("audiofail");
      audio.play();
      alert("Avion se ne nalazi u traženom zračnom prostoru");
    }
  }

  //const [flights, setFlights] = createSignal(null);
  const [loading, setLoading] = createSignal(false);
  // const apiToken = '${flightRadarKey}';

  const fetchFlightData = async () => {
    setLoading(true);
    try {
      //const bounds = '${udaljenostLatE()},${udaljenostLatW()},${udaljenostLngN()},${udaljenostLngS()}';
      const bounds = '50.682,46.218,14.422,22.243';
      const data = await getFlightPositions("9d64c490-73c1-4abc-b7b7-efe16ecf1a6a|GWNYeAKtJ1cXb1wM4fhW3SPeKTbeGABtWTxnaTEh4f35fc6d", bounds);
      //setFlights(data);
      if (data !== null) {
        data.forEach((flight) => {
          setAvionLat(flight.lat);
          setAvionLng(flight.lon);
         let visinaMetri = flight.alt / 3.28;
         visinaMetri = visinaMetri.toFixed(2);
          setVisina(visinaMetri);
          let brzinaA = flight.brz * 1.852;
          brzinaA = Math.round(brzinaA);
          setBrzina(brzinaA);
          setModel(flight.modelA);
          L.marker([avionLat(), avionLng()]).addTo(map())
            .bindPopup(
              `Let: ${flight.call}, Zrakoplov: ${model()}, Altituda: ${visina()} m`,
            )
            .openPopup();
          skeniranje(
            latitude(),
            longitude(),
            avionLat(),
            avionLng(),
            visina(),
            gamma()
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

  /*FLIGHTRADAR24 NERADI
  async function fetchFlightData() {
    try {
      const bounds = {
        udaljenostLatE: udaljenostLatE(),
        udaljenostLatW: udaljenostLatW(),
        udaljenostLngN: udaljenostLngN(),
        udaljenostLngS: udaljenostLngS(),
      };
      const response = await fetch(
        "https://jgzhrmujjmcuanvbufwh.supabase.co/functions/v1/APIPoziv",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(bounds),
        },
      );
      const data = await response.json();
      if (response.ok) {
        data.forEach((flight) => {
          setAvionLat(lat);
          setAvionLng(lon);
          setVisina(alt);
          setBrzina(brz);
          setModel(modelA);
          console.log(model(), brzina(), visina());
          L.marker([avionLat(), avionLng()]).addTo(mapContainer)
            .bindPopup(
              `Let: ${call}, Zrakoplov: ${model()}, Altituda: ${visina()} m`,
            )
            .openPopup();
          skeniranje(
            latitude(),
            longitude(),
            avionLat(),
            avionLng(),
            visina(),
            gamma(),
          );
        });
      } else {
        console.log("Postoje problemi s dohvačanjem informacija o avionima");
      }
    } catch (error) {
      console.log(error);
    }
  }
*/


  //POKRECE SVE RADI
  async function pokretac() {

    await lokacijaKorisnik();

    prozor(latitude(), longitude());
    await getElevation(latitude(), longitude());
    await fetchFlightData();

    console.log("Korisnikova lokacija: ", latitude(), longitude());

  }
  return (
    <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen rounded-3xl">
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
            <p class="text-gray-700 dark:text-gray-300"><strong>Kut X između korisnika i aviona: {kutAvionaX()}</strong></p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Kut Y do aviona: {kutYAvion()}</strong></p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Koordinate aviona: {avionLat()}, {avionLng()}</strong></p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Visina aviona: {visina()}</strong></p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Elevacija: {elevation()}</strong></p>
          </div>

          <div class="bg-gray-100 dark:bg-gray-600 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h2 class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Nagib uređaja</h2>
            <p class="text-gray-700 dark:text-gray-300"><strong>Alpha (Z os): {gamma().toFixed(2)}</strong></p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Beta (X os): {alpha().toFixed(2)}</strong></p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Gamma (Y os): {beta().toFixed(2)}</strong></p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Kut gledanja: {magHeading()}</strong></p>
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
          <audio id="audiosuccess" src="src\assets\bingo.mp3"></audio>
          <audio id="audiofail" src="src\assets\fail.mp3"></audio>

          <button
            onClick={pokretac}
            class="bg-blue-600 text-white font-semibold py-2 px-4 w-full rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Skeniraj
          </button>
        </div>
      </div>
    </div>
  );
}