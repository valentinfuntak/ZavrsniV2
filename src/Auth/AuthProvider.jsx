import { createContext, createSignal, useContext, Show } from "solid-js";
import { supabase } from "../Backend/supabaseClient";

// context
const AuthContext = createContext();

// helper
export function useAuth() {
    return useContext(AuthContext);
}

// component
export function AuthProvider(props) {
    const [session, setSession] = createSignal(null);
    const [loading, setLoading] = createSignal(true);

    // Ažuriraj funkciju koja dohvaća sesiju
    const checkSession = async () => {
        const { data: currentSession, error } = await supabase.auth.getSession();
        if (error) {
            console.error("Error fetching session:", error);
        }
        setSession(currentSession);
        setLoading(false);
    };

    // Poslušaj promjene sesije
    supabase.auth.onAuthStateChange((event, session) => {
        console.log(event, session);
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
            setSession(session);
            setLoading(false);
        } else if (event === "SIGNED_OUT") {
            setSession(null);
            setLoading(false);
        } else if (event === "INITIAL_SESSION") {
            setLoading(false);
        }
    });

    checkSession(); // Pokreni dohvat sesije odmah

    return (
        <Show when={!loading()}>
            <AuthContext.Provider value={session}>
                {props.children}
            </AuthContext.Provider>
        </Show>
    );
}
