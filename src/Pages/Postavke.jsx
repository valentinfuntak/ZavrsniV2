import AuthProvider from '@auth/AuthProvider.jsx';
import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js"; 

function Postavke(props) {
    const session = useAuth();
    const navigate = useNavigate();

    createEffect(() => {
        if (session() === null) {
            navigate("/AuthError");
        }
    });
    return (
        <div class="max-w-screen-lg mx-auto p-6">
            <h1 class="font-mono text-4xl mb-3">POSTAVKE</h1>
        </div>
    );
}

export default Postavke;
