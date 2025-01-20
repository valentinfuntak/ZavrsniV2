import { HashRouter, Route } from "@solidjs/router";

import MainLayout from "./layouts/MainLayout.jsx";
import RegLogLayout from "./layouts/RegLogLayout.jsx";

import { AuthProvider } from "./Auth/AuthProvider.jsx";

import NotFound from "./Pages/Errors/NotFound.jsx";
import AuthError from "./Pages/Errors/AuthError.jsx";

import Registracija from "./Pages/Registracija.jsx";
import Prijava from "./Pages/Prijava.jsx";
import Pocetna from "./Pages/Pocetna.jsx";
import Program from "./Pages/Program.jsx";
import Informacije from "./Pages/Informacije.jsx";
import Onama from "./Pages/Onama.jsx";
import Kontakt from "./Pages/Kontakt.jsx";
import Racun from "./Pages/Racun.jsx";
import Upute from "./Pages/Upute.jsx";
//import Postavke from './Pages/Postavke';

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
      <Route path="/" component={() => (<RegLogLayout><Registracija /></RegLogLayout>)} />
      <Route path="/*" component={() => (<RegLogLayout><NotFound/></RegLogLayout>)} />
      <Route path="/AuthError" component={() => (<RegLogLayout><AuthError /></RegLogLayout>)} />
      <Route path="/Prijava" component={() => (<RegLogLayout><Prijava /></RegLogLayout>)} />
      <Route path="/Pocetna" component={() => (<MainLayout><Pocetna /></MainLayout>)} />
      <Route path="/Program" component={() => (<MainLayout><Program /></MainLayout>)} />
      <Route path="/Informacije" component={() => (<MainLayout><Informacije /></MainLayout>)} />
      <Route path="/Onama" component={() => (<MainLayout><Onama /></MainLayout>)} />
      <Route path="/Kontakt" component={() => (<MainLayout><Kontakt /></MainLayout>)} />
      <Route path="/Racun" component={() => (<MainLayout><Racun /></MainLayout>)} />
      <Route path="/Upute" component={() => (<MainLayout><Upute /></MainLayout>)} />
      </HashRouter>
    </AuthProvider>
  );
}
