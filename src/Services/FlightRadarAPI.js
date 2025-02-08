export async function getFlightPositions(apiToken, bounds) {
    const BASE_URL = 'https://fr24api.flightradar24.com/api';
    const ENDPOINT = '/live/flight-positions/full';
    const url = `${BASE_URL}${ENDPOINT}`;
    
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
        'Accept-Version': 'v1'
    };

    try {
        if (bounds === null) {
            console.log("API nije pronašao granice zračnog prostora");
        } else {
            const response = await fetch(`${url}?bounds=${bounds}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            if (data !== null) {
                const flights = data.data.map((flight) => ({
                    lat: flight.lat,
                    lon: flight.lon,
                    alt: flight.alt,
                    call: flight.callsign,
                    brz: flight.gspeed,
                    modelA: flight.type
                }));
                return flights;
            }
        }
    } catch (error) {
        console.error('Greška pri dohvaćanju podataka o letovima:', error);
        throw error;
    }

}
