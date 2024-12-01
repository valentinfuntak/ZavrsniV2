import { createSignal } from "solid-js";
import Logo from "../assets/logo.png";

function Onama(props) {
    return (
        <div class="min-h-screen bg-gray-900 text-white p-8 rounded-lg">
            <div class="max-w-3xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
                <div class="flex justify-center mb-6">
                    <img src={Logo} alt="Logo" class="w-32 h-auto"/>
                </div>
                <h1 class="font-mono text-4xl font-bold text-center text-gray-100 mb-6">O NAMA</h1>

                <div class="space-y-12">
                    <section>
                        <h2 class="text-2xl font-semibold text-gray-100 mb-4">Škola</h2>
                        <p class="text-lg text-gray-300">
                            Obrtnička škola Koprivnica
                        </p>
                    </section>
                    <section>
                        <h2 class="text-2xl font-semibold text-gray-100 mb-4">Mentor</h2>
                        <p class="text-lg text-gray-300">
                        Tomislav Jakupić
                        </p>
                    </section>
                    <section>
                        <h2 class="text-2xl font-semibold text-gray-100 mb-4">Učenici</h2>
                        <p class="text-lg text-gray-300">
                            Valentin Funtak
                        </p>
                        <p class="text-lg text-gray-300">
                            Noa Golubić
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Onama;
