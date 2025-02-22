import { createSignal } from "solid-js";
import { supabase } from "../Backend/supabaseClient.js";
import { useAuth } from "../Auth/AuthProvider.jsx";
import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

function Racun(props) {
  const session = useAuth();
  const navigate = useNavigate();


  createEffect(() => {
    if (session() === null) {
      navigate("/AuthError");
    }
  });

  const [newEmail, setNewEmail] = createSignal("");
  const [isEmailChanged, setIsEmailChanged] = createSignal(false);
  const [showEmailInput, setShowEmailInput] = createSignal(false);

  const [notifications, setNotifications] = createSignal([]);

  const showNotification = (message, type, duration) => {
    const newNotification = { message, type };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== newNotification));
    }, duration);
  };

  const handleLogout = () => {
    const { error } = supabase.auth.signOut();
    navigate("/Prijava");

    if (error) {
      alert("Nažalost Vas nemožemo odjaviti:", error);
    }
  };

  const handleChangePassword = async () => {
    const email = session().user?.email;
    if (email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://yourapp.com/update-password',
      });
      if (error) {
        showNotification("Greška pri slanju e-maila za resetiranje lozinke: " + error.message, "error", 5000);
      } else {
        showNotification("E-mail za resetiranje lozinke poslan!", "success", 5000);
      }
    }
  };

  const handleChangeEmail = async () => {
    const email = newEmail();
    if (email) {
      const { data, error } = await supabase.auth.updateUser({
        email: email,
      });
      if (error) {
        showNotification("Greška pri promjeni emaila: " + error.message, "error", 5000);
      } else {
        setIsEmailChanged(true);
        showNotification("E-mail uspješno promijenjen. Potvrdite promjenu putem poslanog e-maila!", "success", 5000);
      }
    }
  };

  return (
    <div class="max-w-screen-lg mx-auto p-6 bg-gray-600 shadow-md rounded-lg">
      <div class="flex flex-col sm:flex-row justify-between items-start space-y-6 sm:space-y-0 sm:space-x-4 mb-0">
        {/* Div za podatke o računu */}
        <div class="flex-1">
          <h1 class="font-sans text-3xl sm:text-4xl mb-3 text-yellow-400">Račun</h1>
          <p class="text-lg font-semibold text-gray-300">
            Korisnik: {session() ? "Prijavljen" : "Nije prijavljen"}
          </p>
          {session() && (
            <p class="text-lg mt-2 text-gray-300">
              <strong>Email:</strong> {session().user?.email || "Nema emaila"}
            </p>
          )}
        </div>
        {/* Div za gumbe */}
        {session() && (
          <div class="flex flex-col items-start sm:items-end space-y-4 sm:space-y-4">
            {/* Gumb za prikazivanje inputa za promjenu e-maila */}
            <button
              onClick={() => setShowEmailInput(true)}
              class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Promjeni email
            </button>
            <button
              onClick={handleChangePassword}
              class="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition"
            >
              Promjeni lozinku
            </button>
            <button
              onClick={handleLogout}
              class="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
            >
              Odjava
            </button>
          </div>
        )}
      </div>

      {/* Prikazivanje inputa za e-mail tek nakon klika */}
      {showEmailInput() && (
        <div class="mt-6 bg-white p-6 shadow-md rounded-lg">
          <h2 class="font-sans text-xl text-gray-800">Promjena e-maila</h2>
          <div class="mt-4">
            <input
              type="email"
              class="border-2 border-gray-300 p-2 rounded-md w-full text-black"
              placeholder="Unesite novu e-mail adresu"
              value={newEmail()}
              onInput={(e) => setNewEmail(e.target.value)}
            />
            <button
              onClick={handleChangeEmail}
              class="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Potvrdi promjenu emaila
            </button>
          </div>
        </div>
      )}

      {/* Prikazivanje obavijesti */}
      <div class=" top-16 left-0 right-0 flex justify-start w-full">
        <div class="space-y-2 w-full">
          {notifications().map((notification, index) => (
            <div
              key={index}
              class={`p-4 mt-3 rounded ${notification.type === "error" ? "bg-red-600" :
                notification.type === "success" ? "bg-green-700" :
                  notification.type === "info" ? "bg-blue-400" : ""} text-white shadow-md`}
            >
              <div class="whitespace-normal w-full">
                {notification.message}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Racun;
