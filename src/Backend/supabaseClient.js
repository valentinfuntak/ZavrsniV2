import { createClient } from "@supabase/supabase-js";
import { showNotification} from "../Components/Navigacija.jsx";
import { createSignal } from "solid-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(url, apiKey);

export const [planes, setPlanes] = createSignal(null);


export async function insertPlane(lat, lon, alt, brzina, call, modelA, userID) {
  const { error } = await supabase
    .from("avioninadjeno")
    .insert([
      { latitude: lat, longitude: lon, altitude: alt, speed: brzina, callsign: call, model: modelA, owner_id: userID }
    ]);
  if (error) {
    console.error('Greška pri spremanju podataka u bazu:', error.message);
  } else {
    console.log('Podaci spremljeni u bazu');
    showNotification("Podaci su spremljeni u bazu podataka.", "success", 5000);
  }
}

export async function getPlanes(userID) {
  const { data, error } = await supabase.from("avioninadjeno")
    .select("*")
    .order('id', { ascending: false })
    .limit(5)
    .eq('owner_id', userID);
  if (error) {
    console.error("Greška pri dohvaćanju aviona:", error.message);
    return [];
  }
  console.log("Dohvaćeni podaci:", data);
  setPlanes(data);
}

export async function DodajDesc(modelAvion, opis, brojProizvedeno){
  const { data, error } = await supabase.from("avioninadjeno")
  .update({ description: opis, modelnum: brojProizvedeno })
  .eq("model", modelAvion);

  if (error) {
    console.error("Greška pri ubacivanju opisa:", error.message);
    return [];
  }
   return data;
}

async function StvoriTablicuModelUniq(){
  let { data, error } = await supabase
  .rpc('create_modeli_filtrirano');
if (error) console.error(error);
}



export async function dohvatiSve(userID){
  await StvoriTablicuModelUniq();
  const { data, error } = await supabase.from("modelifiltrirano")
  .select("*")
  .eq('owner_id', userID);
  if (error) {
    console.error("Greška pri dohvaćanju filtrirane tablice:", error.message);
    return [];
  }
  return data;
}

export default supabase;
