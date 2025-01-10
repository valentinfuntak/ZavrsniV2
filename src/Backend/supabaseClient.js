import { createClient } from "@supabase/supabase-js";
import { AzurirajBazu } from "../Components/Navigacija.jsx";
import { pokreniAzuriranje } from "../Components/Navigacija.jsx";

const url = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(url, apiKey);

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

export async function azurirajTablicu(){
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
