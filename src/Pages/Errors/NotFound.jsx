// src/pages/NotFound.jsx
function NotFound() {
  const goToHome = () => {
    window.location.href = '/';
  };

  return (
    <div class="flex items-center justify-center h-screen bg-gray-900 text-gray-100">
      <div class="text-center p-6 bg-gray-800 shadow-lg rounded-lg">
        <h1 class="text-3xl font-bold text-red-500">404 - Stranica nije pronađena</h1>
        <p class="mt-4 text-gray-300">Ova stranica ne postoji. Provjerite URL ili se vratite na početnu.</p>
        <button
          onClick={goToHome}
          class="mt-6 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Vrati se na početnu
        </button>
      </div>
    </div>
  );
}

export default NotFound;
