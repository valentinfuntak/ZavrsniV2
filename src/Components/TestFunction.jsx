import { onMount, createSignal  } from "solid-js";
import { supabase } from "../Backend/supabaseClient";

export default function TestFunction(props) {

    const [data, setData] = createSignal(null); // Signal za praćenje podataka
    const [error, setError] = createSignal(null); // Signal za praćenje grešaka

    

    onMount(async () => {
        const { data, error } = await supabase.functions.invoke('hello-world', {
            body: { name: 'Pero' }
        });
        if (error) {
            console.log(error);
            setError(error.message); // Postavi grešku ako postoji
        } else {
            setData(data); 
            console.log(data);// Postavi podatke ako su uspješno dohvaćeni
        }
    });

    
    return (
        <>
            <div>{data() ? data().message : "Loading..."}</div>
            {error() && <div>Error: {error()}</div>}
        </>
    );
}