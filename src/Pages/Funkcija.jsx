import { createSignal } from "solid-js";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const Funkcija = () => {
  const [message, setMessage] = createSignal("Klikni na gumb za dohvaćanje!");

  const fetchMessage = async () => {
    setMessage("Učitavanje...");
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/hello-world`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ name: "SolidJS" }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Greška prilikom dohvaćanja:", error);
      setMessage("Neuspjelo dohvaćanje poruke.");
    }
  };

  return (
    <div class="text-center mt-4">
      <h1 class="text-2xl font-semibold">Supabase Edge Function</h1>
      <p class="mt-2 text-gray-600">{message()}</p>
      <button
        class="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
        onClick={fetchMessage}
      >
        Pozovi hello-world funkciju
      </button>
    </div>
  );
};

export default Funkcija;
