import { useAuth } from "../auth/AuthProvider";

function Pocetna() {
    return (
        <>
            <div class="min-h-screen bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex flex-col justify-center items-center text-white">
                <div class="text-center p-6">
                    <h1 class="font-mono text-5xl font-bold mb-4">Dobrodošli na Planespotter</h1>
                    <p class="text-lg mb-8">
                        Ova aplikacija omogućava skeniranje neba i praćenje aviona u stvarnom vremenu.
                        Saznajte više o letovima u vašem području!
                    </p>
                </div>
            </div>
        </>
    );
}

export default Pocetna;
