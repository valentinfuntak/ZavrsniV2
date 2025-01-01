import { createSignal } from "solid-js";
import { supabase } from "../Backend/supabaseClient";

export default function TestFunction(props) {
    const [data, setData] = createSignal(null); // Signal za praćenje podataka
    const [error, setError] = createSignal(null); // Signal za praćenje grešaka

    // Funkcija koja invokira Supabase funkciju
    const invokeFunction = async () => {
        const { data, error } = await supabase.functions.invoke('hello-world', {
            body: { name: 'Pero' }
        });
        if (error) {
            console.log(error);
            setError(error.message); // Postavi grešku ako postoji
        } else {
            setData(data);
            console.log(data); // Postavi podatke ako su uspješno dohvaćeni
        }
    };

    return (
        <>
            <button 
                onclick={invokeFunction} 
                class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Pozovi funkciju
            </button>
            <div>{data() ? data().message : "Nema podataka."}</div>
            {error() && <div>Error: {error()}</div>}
        </>
    );
}