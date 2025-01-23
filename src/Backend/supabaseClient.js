import { createClient } from "@supabase/supabase-js";
import { showNotification } from "../Components/Navigacija.jsx";
import { AzurirajBazu, setAzurirajBazu } from "../Components/Navigacija.jsx";
import { pokreniAzuriranje } from "../Components/Navigacija.jsx";

const url = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(url, apiKey);

export async function insertPlane(lat, lon, alt,brzina, call, modelA) {
  const { error } = await supabase
    .from('AvioniNadjeno')
    .insert([
      { latitude: lat, longitude: lon, altitude: alt, speed: brzina, callsign: call, model: modelA }
    ]);
  if (error) {
    console.error('Greška pri spremanju podataka u bazu:', error.message);
  } else {
    console.log('Podaci spremljeni u bazu');
    showNotification("Podaci su spremljeni u bazu podataka.", "success", 5000);
  }
}

export async function getPlanes() {
  const { data, error } = await supabase.from("AvioniNadjeno")
    .select("*")
    .order('id', { ascending: false })
    .limit(5);
  if (error) {
    console.error("Greška pri dohvaćanju aviona:", error.message);
    return [];
  }
  console.log("Dohvaćeni podaci:", data);
  return data;
}

export async function azurirajTablicu() {
  await pokreniAzuriranje(AzurirajBazu());
  const { data, error } = await supabase.from("AvioniNadjeno")
    .select("*")
    .order('id', { ascending: false })
    .limit(5);
  if (error) {
    console.error("Greška pri dohvaćanju aviona:", error.message);
    return [];
  }
  console.log("Azuriranje je uspjelo:", data);
  setAzurirajBazu(false);
  return data;
}

export async function DodajDesc(modelAvion, opis, brojProizvedeno){
  const { data, error } = await supabase.from("AvioniNadjeno")
  .update({ description: opis, modelNum: brojProizvedeno })
  .eq("model", modelAvion);

  if (error) {
    console.error("Greška pri ubacivanju opisa:", error.message);
    return [];
  }
   return data;
}

//Group by, select, eq, max
export async function dohvatiHangar(){
  const { data, error } = await supabase.from("AvioniNadjeno")
  .select("*");
  if (error) {
    console.error("Greška pri dohvaćanju aviona:", error.message);
    return [];
  }
  return data;
}


export default supabase;
