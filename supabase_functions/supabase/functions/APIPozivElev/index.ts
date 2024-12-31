// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

console.log("Hello from Functions!")

serve(async (req: Request) => {
  if(req.method ==="POST"){
   try{
     const body = await req.json();
     const {dataset, lat, lng} = body;
   
   if (!dataset || !lat || !lng) {
     return new Response(JSON.stringify({ message: "Elevacija se nemože odrediti zbog greške u dohvaćanju koordinata" }), {
       headers: { "Content-Type": "application/json" },
     
 });
}else{
const extResponse= await fetch(
`https://api.opentopodata.org/v1/${dataset}?locations=${lat},${lng}`,
{
 method: "GET",
 headers:{
   "Content-Type": "application/json"
 },
});
const jsonData = await extResponse.json();
if(!jsonData){
 return new Response(
 JSON.stringify({message: "Nema podataka o elevaciji"}),
 { headers: { "Content-Type": "application/json" }, status: 404 }
 );
}

const elevationData = jsonData.results[0].elevation;

return new Response(
 JSON.stringify({ message: "Korisnikova elevacija", elevationData }),
 { headers: { "Content-Type": "application/json" } }
);

}
}catch(error){
 console.error(error);
 return new Response("Došlo je do greške!");
}
  }else{
return new Response("Metoda nije dozvoljena");
  }
  });

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/APIpozivELEV' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/