import OpenAI from "openai";
import { DodajDesc } from "../Backend/supabaseClient.js";
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_KEY,
    dangerouslyAllowBrowser: true
});

export async function getFlightInfo(modelAviona){
    try {
        if (modelAviona === null) {
          console.log("API nije uspio dohvatiti model aviona");
          return null;
        }
const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
        { role: "developer", content: "Ti si asistent koji piše 4 rečenice o navedenom zrakoplovu. Neka informacije budu kratke i točne, a zadnja rečenica neka bude: 'Ukupna peoizvodnja modela je (točan broj proizvedenih modela, brojeve ne razdvajaj s . ili ,)'." },
        {
            role: "user",
            content: `Napiši mi neke važne informacije o zrakoplovu: ${modelAviona}.`,
        },
    ],
});
const informacije = completion.choices[0].message.content;
let Lista = [];
Lista = informacije.split(" ");
let duljina = Lista.length;
let brojString = Lista[duljina - 1];
brojString = brojString.replace(".", "");
brojString = brojString.replace(",", "");

let brojModela = parseInt(brojString, 10);

await DodajDesc(modelAviona, informacije, brojModela);
alert("AVION JE DODAN");    

return informacije;

 } catch (error) {
        console.error("Greška pri dohvaćanju podataka o modelu aviona:", error);
        throw error;
      }
}
