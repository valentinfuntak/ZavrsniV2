// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

//Deno.serve(async (req) => {
  Deno.serve(async (req: Request) => {
   if(req.method ==="POST"){
    try{
      const body = await req.json();
      const {udaljenostLatE, udaljenostLatW, udaljenostLngN, udaljenostLngS} = body;
    
    if (!udaljenostLatE || !udaljenostLatW || !udaljenostLngN || !udaljenostLngS) {
      return new Response(JSON.stringify({ message: "Koordinate nisu pronađene" }), {
        headers: { "Content-Type": "application/json" },
      
  });
}else{
  //Pristupanje flightradar APIU s varijablama koje su sad kod servera, Dohvacanje podataka
 const extResponse= await fetch(
 `https://fr24api.flightradar24.com/common/v1/search.json?bounds=${udaljenostLatE},${udaljenostLatW},${udaljenostLngN},${udaljenostLngS}`,
 {
  method: "GET",
  headers:{
    Authorization:`Bearer ${process.env.FLIGHTRADAR_KEY}`,
    "Content-Type": "application/json",
  },
 });
 const jsonData = await extResponse.json();

 //ako podaci ne postoje
 if(!jsonData){
  return new Response(
  JSON.stringify({message: "Nema zrakoplova u danom području"}),
  { headers: { "Content-Type": "application/json" }, status: 404 }
  );
}

//Ako podaci postoje dohvacaju se podaci i spremaju se u map flights
const flights = jsonData.data.map((flight:any)=>({
  lat: flight.lat,
  lon: flight.lon,
  alt: flight.alt,
  call: flight.callsign,
  brz: flight.gspeed,
  modelA: flight.type
}));

return new Response(
  JSON.stringify({ message: "Nađeni avioni", flights }),
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/APIpoziv' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/