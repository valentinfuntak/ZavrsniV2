import Logo from "../assets/logo.png";
import { supabase } from "../Backend/supabaseClient.js";
import { useAuth } from "../Auth/AuthProvider.jsx";
import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

function Onama(props) {
    const session = useAuth();
    const navigate = useNavigate();

    createEffect(() => {
        if (session() === null) {
            navigate("/AuthError");
        }
    });

    const handleLogout = () => {
        const { error } = supabase.auth.signOut();
        navigate("/Prijava");

        if (error) {
            alert("Nažalost Vas nemožemo odjaviti:", error);
        }
    };

    return (
        <div class="p-8">
            <h1 class="font-mono text-4xl mb-6">O NAMA</h1>

            <div class="space-y-6">
                <div class="flex justify-center mb-10">
                    <a onClick={handleLogout} href="https://ss-obrtnicka-koprivnica.skole.hr/">
                        <img

                            src={Logo}
                            alt="Logo"
                            class="w-40 h-auto rounded-full shadow-md transform hover:scale-110 transition-transform duration-300"
                        />
                    </a>
                </div>
                <div>
                    <h2 class="text-xl font-semibold">Škola</h2>
                    <p>
                        Obrtnička škola Koprivnica
                    </p>
                </div>
                <div>
                    <h2 class="text-xl font-semibold">Mentor</h2>
                    <p>
                        Tomislav Jakupić
                    </p>
                </div>

                <div>
                    <h2 class="text-xl font-semibold">Učenici</h2>
                    <p class="text-lg text-gray-300">
                        Valentin Funtak <br />
                        Noa Golubić
                    </p>
                </div>

                <div>
                    <p class="text-lg text-gray-300">

                    </p>
                </div>
            </div>
        </div>
    );
}

export default Onama;
