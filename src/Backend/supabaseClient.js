import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(url, apiKey);

export async function getPlanes() {
    const { data, error } = await supabase.from("AvioniNadjeno").select("*");
    if (error) {
        console.error("Greška pri dohvaćanju aviona:", error.message);
        return [];
      }
      console.log("Dohvaćeni podaci:", data);
      return data;
  }

export default supabase;
