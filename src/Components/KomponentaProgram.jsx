import { createSignal, onCleanup, onMount } from "solid-js";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Uključite Leaflet CSS

export default function KomponentaProgram(props) {
  const [map, setMap] = createSignal(null);

  // Funkcija za postavljanje mape
  const initializeMap = (mapContainer) => {
    // Kreiramo instancu mape
    const mapInstance = L.map(mapContainer, {
      zoomControl: false, // Uklanjanje kontrole za zoom
      attributionControl: false, // Uklanjanje atribucije
    }).setView([51.505, -0.09], 13); // Postavite početnu poziciju i zoom

    // Dodajemo OpenStreetMap tile
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

  // Funkcija za inicijalizaciju komponente
  onMount(() => {
    const mapContainer = document.getElementById("map-container");
    if (mapContainer) {
      initializeMap(mapContainer);
    }
  });

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
            <p class="text-gray-700 dark:text-gray-300"><strong>Kut X između korisnika i aviona:</strong> 0</p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Kut Y do aviona:</strong> 0</p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Koordinate aviona:</strong> 0, 0</p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Visina aviona:</strong> 0</p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Elevacija:</strong> 171</p>
          </div>
          <div class="bg-gray-100 dark:bg-gray-600 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h2 class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Nagib uređaja</h2>
            <p class="text-gray-700 dark:text-gray-300"><strong>Alpha (Z os):</strong> 0.00</p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Beta (X os):</strong> 0.00</p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Gamma (Y os):</strong> 0.00</p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Kut gledanja:</strong> 0</p>
          </div>
        </div>
        <div class="flex justify-center mt-6">
          <button class="bg-blue-600 text-white font-semibold py-2 px-4 w-full rounded-lg shadow-md hover:bg-blue-700 transition duration-200">
            Skeniraj
          </button>
        </div>
      </div>
    </div>
  );
}
