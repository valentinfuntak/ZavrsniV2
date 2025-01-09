export async function getElevationData(lat, lng) {
    const url = `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`;
  
    try {
      if (lat === null || lng === null) {
        console.log("API nije uspio dohvatiti latitudu ili longitudu");
        return null;
      }
  
      const response = await fetch(url);
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      if (data !== null) {
        console.log("Prikupljena elevacija:", data.elevation);
        return data.elevation; 
      } else {
        console.log("API nije pronašao podatke za elevaciju.");
        return null;
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju podataka o elevaciji:", error);
      throw error;
    }
  }