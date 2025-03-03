export async function getImgUrl(planeRegistration) {
    try {
        if (planeRegistration !== null) {
            const response = await fetch(`https://api.adsbdb.com/v0/aircraft/${planeRegistration}`, {
                method: 'GET'
            });
            if (!response.ok) {
                console.log("Došlo je do greške pri dohvaćanju url-a slike!");
                return null;
            } else {
                const data = await response.json();
                let ImgUrl = data.response.aircraft.url_photo;
                console.log(planeRegistration);
                return ImgUrl;
            }
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
    }
}