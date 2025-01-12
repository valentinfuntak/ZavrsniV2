import { createClient } from "@supabase/supabase-js";
import { showNotification } from "../Components/Navigacija.jsx";
import { AzurirajBazu } from "../Components/Navigacija.jsx";
import { pokreniAzuriranje } from "../Components/Navigacija.jsx";

const url = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(url, apiKey);

export async function insertPlane(lat, lon, alt, brzina, call, modelA) {
  const { error } = await supabase
    .from('AvioniNadjeno')
    .insert([
      { latitude: lat, longitude: lon, altitude: alt, speed: brzina, callsign: call, model: modelA }
    ]);
  pokreniAzuriranje(AzurirajBazu());
  if (error) {
    console.error('Greška pri spremanju podataka u bazu:', error.message);
  } else {
    console.log('Podaci spremljeni u bazu');
    showNotification("Podaci su spremljeni u bazu podataka.", "success");
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
  await pokreniAzuriranje();
  const { data, error } = await supabase.from("AvioniNadjeno")
    .select("*")
    .order('id', { ascending: false })
    .limit(5);
  if (error) {
    console.error("Greška pri dohvaćanju aviona:", error.message);
    return [];
  }
  console.log("Dohvaćeni podaci:", data);
  setAzurirajBazu(false);
  return data;
}


export default supabase;
