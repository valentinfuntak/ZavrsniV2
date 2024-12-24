import { createSignal } from "solid-js";

function FetchMessage() {
  // Signal za pohranu poruke
  const [message, setMessage] = createSignal("");
  const [loading, setLoading] = createSignal(false);  // Signal za praćenje statusa učitavanja
  const [error, setError] = createSignal(""); // Signal za pohranu greške

  // URL i token mogu biti pohranjeni kao varijable za lakšu konfiguraciju
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnemhybXVqam1jdWFudmJ1ZndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NjcyNDksImV4cCI6MjA0OTM0MzI0OX0.GX-LLe2w4zDA8_lHv8HVY15PikbGNo9Tnz-WzB-ZwvI"; // Zamijeni s tvojim tokenom
  const url = "https://jgzhrmujjmcuanvbufwh.supabase.co/functions/v1/hello-world"; // URL tvoje Supabase funkcije

  // Funkcija koja poziva Supabase funkciju
  async function fetchMessage() {
    setLoading(true);  // Postavljanje statusa učitavanja na true
    setError("");      // Resetiranje greške

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Dodaj Authorization header
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Functions" }), // Pošaljite ime kao JSON objekt
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message); // Postavi poruku u signal
      } else {
        setMessage("Došlo je do pogreške prilikom poziva funkcije.");
      }
    } catch (error) {
      console.error("Greška:", error);
      setError("Došlo je do pogreške pri povezivanju.");
    } finally {
      setLoading(false);  // Postavljanje statusa učitavanja na false
    }
  }

  return (
    <div>
      <h2>Supabase funkcija</h2>
      <button onClick={fetchMessage} disabled={loading()}>
        {loading() ? "Učitavanje..." : "Pozovi funkciju"}
      </button>
      {error() && <p style={{ color: "red" }}>{error()}</p>} {/* Prikazivanje greške */}
      <p>{message()}</p> {/* Prikazivanje poruke */}
    </div>
  );
}

export default FetchMessage;
