import { useAuth } from "../Auth/AuthProvider.jsx";
import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

function Pocetna() {
    const session = useAuth();
    const navigate = useNavigate();

    createEffect(() => {
        if (session() === null) {
            navigate("/AuthError");
        }
    });

    return (
        <div class="min-h-screen bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex flex-col justify-center items-center text-white">
            <div class="text-center p-6">
                <h1 class="font-mono text-5xl font-bold mb-4">Dobrodošli na Planespotter</h1>
                <p class="text-lg mb-8">
                    Ova aplikacija omogućava skeniranje neba i praćenje aviona u stvarnom vremenu.
                    Saznajte više o letovima u vašem području!
                </p>
                {/* <p class="text-lg mb-8">Ova aplikacija omogućava skeniranje neba i praćenje aviona u stvarnom vremenu. Saznajte više o letovima u vašem području!</p>
                    class="bg-blue-600 text-white py-2 px-6 rounded-lg text-xl"
                    onClick={() => navigate("/Funkcija")}
                >
                    Saznaj više
                </button> */}
            </div>
        </div>
    );
}

export default Pocetna;
