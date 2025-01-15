import { useNavigate } from "@solidjs/router"; 

function AuthError() {
  const navigate = useNavigate(); 

  const goToHome = () => {
    navigate("/Prijava"); 
  };

  return (
    <div class="flex items-center justify-center h-screen bg-gray-900 text-gray-100">
      <div class="text-center p-6 bg-gray-800 shadow-lg rounded-lg">
        <h1 class="text-3xl font-bold text-red-500">Autentifikacija potrebna</h1>
        <p class="mt-4 text-gray-300">Morate se prijaviti kako biste pristupili ovoj stranici.</p>
        <button
          onClick={goToHome}
          class="mt-6 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Prijava
        </button>
      </div>
    </div>
  );
}

export default AuthError;
