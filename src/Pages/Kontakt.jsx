import { useAuth } from "../Auth/AuthProvider.jsx";
import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js"; 
import { supabase } from "../Backend/supabaseClient.js";

function Kontakt(props) {
      const session = useAuth();
    const navigate = useNavigate();

    createEffect(() => {
        if (session() === null) {
            navigate("/AuthError");
        }
    });

     const handleLogout =  () => {
            const { error } = supabase.auth.signOut();
            navigate("/Prijava");
    
            if(error){
                alert("Nažalost Vas nemožemo odjaviti:", error);
            }
          };
    
    return (
      <div class="p-8">
        <h1 class="font-mono text-4xl mb-6">KONTAKT</h1>
  
        <div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold">Obrtnička škola Koprivnica</h2>
            <p>
              Posjetite <a onClick={handleLogout} href="https://ss-obrtnicka-koprivnica.skole.hr/" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">službenu stranicu škole</a> za više informacija.
            </p>
          </div>
  
          <div>
            <h2 class="text-xl font-semibold">GitHub računi</h2>
            <ul class="space-y-2">
              <li class="flex items-center">
                <a onClick={handleLogout}
                  href="https://github.com/valentinfuntak"
                  class="text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Valentin Funtak
                </a>
              </li>
              <li class="flex items-center">
                <a onClick={handleLogout}
                  href="https://github.com/NoaGolubic"
                  class="text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Noa Golubić
                </a>
              </li>
            </ul>
          </div>
  
          <div>
            <h2 class="text-xl font-semibold">Repozitorij završnog rada</h2>
            <ul class="space-y-2">
              <li class="flex items-center">
                <a onClick={handleLogout}
                  href="https://github.com/valentinfuntak/ZavrsniV2"
                  class="text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Završni rad
                </a>
              </li>
            </ul>
          </div>
  
          <div>
            <h2 class="text-xl font-semibold">Kontakt e-mail</h2>
            <ul class="space-y-2">
              <li>
                Valentin Funtak:{" "}
                <a
                  href="mailto:valentinfuntakk@gmail.com"
                  class="text-blue-500 hover:underline"
                >
                  valentinfuntakk@gmail.com
                </a>
              </li>
              <li>
                Noa Golubić:{" "}
                <a
                  href="mailto:noagolubic030606@gmail.com"
                  class="text-blue-500 hover:underline"
                >
                  noagolubic030606@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  export default Kontakt;
  