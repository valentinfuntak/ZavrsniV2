import { createClient } from "@supabase/supabase-js";
import { showNotification} from "../Components/Navigacija.jsx";
import { createSignal } from "solid-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(url, apiKey);

export const [planes, setPlanes] = createSignal(null);
export const [userLeadenboard, setUserLeadenboard] = createSignal(null);


export async function insertPlane(userNam, lat, lon, alt, brzina, call, modelA, userID, Livery, registrationA) {
  const { error } = await supabase
    .from("avioninadjeno")
    .insert([
      {username: userNam, latitude: lat, longitude: lon, altitude: alt, speed: brzina, callsign: call, model: modelA, owner_id: userID, livery: Livery, registration: registrationA }
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


async function StvoriTablicuModelUniq(){
  let { data, error } = await supabase
  .rpc('create_modeli_filtrirani');
if (error) console.error(error);
}



export async function dohvatiSve(userID){
  await StvoriTablicuModelUniq();
  const { data, error } = await supabase.from("modelifiltrirani")
  .select("*")
  .eq('owner_id', userID);
  if (error) {
    console.error("Greška pri dohvaćanju filtrirane tablice:", error.message);
    return [];
  }
  return data;
}

export async function spremiSliku(modelAV, urlAviona, userID){
const { data, error } = await supabase.from("avioninadjeno")
.select("url")
.eq('model', modelAV);

if(error){
  console.log(error);
}

if(data.length === 0 || !data[0].url){
  const { data, error } = await supabase.from("avioninadjeno")
  .update({url: urlAviona})
  .eq('model', modelAV)
  .eq('owner_id', userID);
  if (error) {
    console.error("Greška pri spremanju slike", error.message);
  }
  return data;
}else{
  console.log("ovaj model zrakoplova već ima sliku");
}
}

export async function DodajDesc(
  modelAvion,
  opis,
  brojProizvedeno
) {
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

export async function getUserLeadenboard(){
  const { error, data} = await supabase
  .from("modelifiltrirani")
  .select("*")
  .order('modelnum', { ascending: true })
  .limit(100)

  if (error) {
    console.error("Greška pri dohvacanju korisnika:", error.message);
  }

  setUserLeadenboard(data);
  console.log(data);
}
export async function getLatesResearchDate(modelAv){
  const { error, data} = await supabase
  .from("avioninadjeno")
  .select("time, description, modelnum")
  .eq("model", modelAv)
  .not("description", "is", null) 
  .order('time', { ascending: false })
  .limit(1)
  

  if (error) {
    console.error("Greška pri dohvacanju korisnika:", error.message);
  }

console.log(data);
return data;
}


export default supabase;
