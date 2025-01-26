/*import OpenAI from "openai";
import { DodajDesc } from ../src/Backend/supabaseClient.js;
const OpenAikey = import.meta.env.OPENAI_KEY;
const openai = new OpenAI({
    apiKey: OpenAikey
});

export async function getFlightInfo(modelAviona){
    try {
        if (modelAviona === null) {
          console.log("API nije uspio dohvatiti model aviona");
          return null;
        }
const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "Ti si asistent koji piše 4 rečenice o navedenom zrakoplovu. Neka informacije budu kratke i točne, a zadnja rečenica neka bude: "Ukupna peoizvodnja modela je (točan broj proizvedenih aviona bez . ili ,)"." },
        {
            role: "user",
            content: `Napiši mi neke važne informacije o zrakoplovu: ${modelAviona}.`,
        },
    ],
});


    }catch (error) {
        console.error("Greška pri dohvaćanju podataka o modelu aviona:", error);
        throw error;
      }
    const informacije = completion.choices[0].message;

    let Lista = [];
    lista = informacije.split(" ");
    let duljina = lista.length;
    let brojString = lista[duljina - 1];
    brojString = brojString.replace(".", "");

    let brojModela = parseInt(brojString, 10);

    await DodajDesc(modelAviona, informacije, brojModela);

    return informacije;
}*/

