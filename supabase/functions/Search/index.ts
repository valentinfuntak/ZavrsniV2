// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.86.1";
//import { corsHeaders } from '../_shared/cors.ts'
//import { DodajDesc } from "../Backend/supabaseClient.js";
const openai = new OpenAI({
  apiKey: Deno.env.get("VITE_OPENAI_KEY")
});
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  Authorization: `Bearer ${Deno.env.get("VITE_OPENAI_KEY")}`,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
const urlS = Deno.env.get("VITE_SUPABASE_URL");
const apiKey = Deno.env.get("VITE_SUPABASE_API_KEY");
const supabase = createClient(urlS, apiKey);
async function getFlightInfo(model) {
  try {
    if (model === null) {
      console.log("API nije uspio dohvatiti model aviona");
      return null;
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "developer",
          content: "Ti si asistent koji piše 4 rečenice o navedenom zrakoplovu. Neka informacije budu kratke i točne, a zadnja rečenica neka bude: 'Ukupna peoizvodnja modela je (točan broj proizvedenih modela, brojeve ne razdvajaj s . ili ,)'."
        },
        {
          role: "user",
          content: `Napiši mi neke važne informacije o zrakoplovu: ${model}.`
        }
      ]
    });
    const info = completion.choices[0].message.content;
    let Lista = [];
    Lista = info.split(" ");
    const duljina = Lista.length;
    let brojString = Lista[duljina - 1];
    brojString = brojString.replace(".", "");
    brojString = brojString.replace(",", "");
    const brojModela = parseInt(brojString, 10);
    return {
      info,
      brojModela
    };
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka o modelu aviona:", error);
    throw error;
  }
}
console.log("Hello from Functions!");
serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  try {
    const { model } = await req.json();
    console.log("U EDGE FUNKCIJI MODEL JE", model, typeof model);
    if (!model) {
      return new Response("model se nije dohvatio", {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    const informacije = await getFlightInfo(model);
    return new Response(JSON.stringify({
      informacije
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
}); /* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/ResereachModel' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/ 
