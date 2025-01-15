import { Router, Route } from "@solidjs/router";

import MainLayout from "./layouts/MainLayout";
import RegLogLayout from "./layouts/RegLogLayout";

import { AuthProvider } from "./Auth/AuthProvider";

import NotFound from "./Pages/Errors/NotFound";
import AuthError from "./Pages/Errors/AuthError";

import Registracija from "./Pages/Registracija";
import Prijava from "./Pages/Prijava";
import Pocetna from "./Pages/Pocetna";
import Program from "./Pages/Program";
import Informacije from "./Pages/Informacije";
import Onama from "./Pages/Onama";
import Kontakt from "./Pages/Kontakt";
import Racun from "./Pages/Racun";
//import Postavke from './Pages/Postavke';

export default function App() {
  return (
    <AuthProvider>
      <Router>
      <Route path="/" component={() => (<RegLogLayout><Registracija /></RegLogLayout>)} />
      <Route path="/*" component={() => (<RegLogLayout><NotFound/></RegLogLayout>)} />
      <Route path="/Prijava" component={() => (<RegLogLayout><Prijava /></RegLogLayout>)} />
      <Route path="/Pocetna" component={() => (<MainLayout><Pocetna /></MainLayout>)} />
      <Route path="/Program" component={() => (<MainLayout><Program /></MainLayout>)} />
      <Route path="/Informacije" component={() => (<MainLayout><Informacije /></MainLayout>)} />
      <Route path="/Onama" component={() => (<MainLayout><Onama /></MainLayout>)} />
      <Route path="/Kontakt" component={() => (<MainLayout><Kontakt /></MainLayout>)} />
      <Route path="/Racun" component={() => (<MainLayout><Racun /></MainLayout>)} />
      </Router>
    </AuthProvider>
  );
}
