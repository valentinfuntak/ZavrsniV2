import { createSignal } from 'solid-js';
import supabase from '../Backend/supabaseClient';  // Importirajte svoju instancu Supabase
import Plane from "../assets/planefav.png";

function Registracija(props) {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [error, setError] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [success, setSuccess] = createSignal(false);  // Dodajte signal za uspjeh

  // Funkcija za registraciju korisnika
  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);  // Resetirajte uspjeh

    if (password() !== confirmPassword()) {
      setError('Lozinke se ne poklapaju!');
      setLoading(false);
      return;
    }

    try {
      // Kreirajte korisnika pomoću Supabase-a
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email(),
        password: password(),
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Dohvatite user_id iz odgovora nakon registracije
      const userId = data?.user?.id;

      if (userId) {
        // Spremite korisničke podatke u vašu tablicu 'users'
        const { data: userData, error: dbError } = await supabase
          .from('users') // Vaša tablica korisnika
          .insert([{
            user_id: userId,  // Spremite user_id
            email: email(),
            password: password(),  // Spremite lozinku (ako želite)
            created_at: new Date().toISOString(),  // Datum kreiranja
          }]);

        if (dbError) {
          setError(`Greška prilikom spremanja u bazu: ${dbError.message}`);
        } else {
          setSuccess(true);  // Postavite uspjeh
          console.log('Korisnik uspješno spremljen u bazu:', userData);
          // Preusmjerite korisnika na prijavu nakon uspješne registracije
          window.location.href = '/#/prijava';
        }
      } else {
        setError('Greška prilikom dobivanja user_id.');
      }
    } catch (err) {
      setError('Došlo je do pogreške pri registraciji.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src={Plane}
              alt="logo"
            />
            Plane Spotter
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Registracija
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleRegistration}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    value={email()}
                    onInput={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Lozinka
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={password()}
                    onInput={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Potvrdite lozinku
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={confirmPassword()}
                    onInput={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {error() && (
                  <div className="text-red-500 text-sm">{error()}</div>
                )}
                {success() && (
                  <div className="text-green-500 text-sm">Račun uspješno registriran! Preusmjeravam na prijavu...</div>
                )}
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  disabled={loading()}
                >
                  {loading() ? 'Registracija...' : 'Registracija'}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Već imate račun?{" "}
                  <a
                    href="/prijava"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Prijavite se ovdje.
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Registracija;
