import { createSignal } from "solid-js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_API_KEY);

const Funkcija = () => {
  const [message, setMessage] = createSignal("");

  const handleClick = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("Search", {
        body: { name: "Functions" },
      });

      if (error) {
        console.error("Greška pri pozivu funkcije:", error.message);
        setMessage("Došlo je do greške pri pozivu funkcije.");
      } else {
        setMessage(data.message);
        console.log("Odgovor funkcije:", data.message);
      }
    } catch (err) {
      console.error("Greška u pozivu funkcije:", err);
      setMessage("Došlo je do nepredviđene greške.");
    }
  };

  return (
    <div>
      <h1>Supabase Edge Funkcija</h1>
      <button
        onClick={handleClick}
        class="bg-blue-500 text-white p-2 rounded-md"
      >
        Pozovi funkciju
      </button>
      <p>{message()}</p>
    </div>
  );
};

export default Funkcija;
