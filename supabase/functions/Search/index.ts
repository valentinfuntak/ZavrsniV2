// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

console.log("Hello from Functions!");

const openai = new OpenAI({
  apiKey: Deno.env.get("VITE_OPENAI_KEY"),
});

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const modelAviona = url.searchParams.get("model");

    if (!modelAviona) {
      return new Response("Model se nije dohvatio", { status: 400 });
    }

    const informacije = await getFlightInfo(modelAviona);

    return new Response(JSON.stringify({ informacije }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

async function getFlightInfo(modelAviona: string): Promise<string | null> {
  try {
    if (!modelAviona) {
      console.log("API nije uspio dohvatiti model aviona");
      return null;
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "developer",
          content:
            "Ti si asistent koji piše 4 rečenice o navedenom zrakoplovu. Neka informacije budu kratke i točne, a zadnja rečenica neka bude: 'Ukupna peoizvodnja modela je (točan broj proizvedenih modela, brojeve ne razdvajaj s . ili ,)'.",
        },
        {
          role: "user",
          content: `Napiši mi neke važne informacije o zrakoplovu: ${modelAviona}.`,
        },
      ],
    });
    const informacije = completion.choices[0].message.content;
    const lista = informacije.split(" ");
    const duljina = lista.length;
    let brojString = lista[duljina - 1];
    brojString = brojString.replace(".", "").replace(",", "");
    const brojModela = parseInt(brojString, 10);
    await DodajDesc(modelAviona, informacije, brojModela);
    return informacije;
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka o modelu aviona:", error);
    throw error;
  }
}

async function DodajDesc(
  modelAvion: string,
  opis: string,
  brojProizvedeno: number
): Promise<any> {
  const { data, error } = await supabase
    .from("avioninadjeno")
    .update({ description: opis, modelnum: brojProizvedeno })
    .eq("model", modelAvion);
  if (error) {
    console.error("Greška pri ubacivanju opisa:", error.message);
    return [];
  }
  return data;
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/ResereachModel' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
