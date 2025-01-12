import { HashRouter, Route } from "@solidjs/router";

import { Router, A } from "@solidjs/router";
import { Show } from "solid-js";

import MainLayout from "./layouts/MainLayout";
import RegLogLayout from "./layouts/RegLogLayout";

import { AuthProvider, useAuth } from "./Auth/AuthProvider";

import Registracija from "./Pages/Registracija";
import Prijava from "./Pages/Prijava";
import Pocetna from "./Pages/Pocetna";
import Program from "./Pages/Program";
import Informacije from "./Pages/Informacije";
import Onama from "./Pages/Onama";
import Kontakt from "./Pages/Kontakt";
import Postavke from './Pages/Postavke';


export default function App() {
  return (
    <HashRouter>
      <Route path="/" component={<RegLogLayout><Registracija /></RegLogLayout>}/>
      <Route path="/Prijava" component={<RegLogLayout><Prijava /></RegLogLayout>} />
      <Route path="/Pocetna" component={<MainLayout><Pocetna /></MainLayout>} />
      <Route path="/Program" component={<MainLayout><Program /></MainLayout>} />
      <Route path="/Informacije" component={<MainLayout><Informacije /></MainLayout>} />
      <Route path="/Onama" component={<MainLayout><Onama /></MainLayout>} />
      <Route path="/Kontakt" component={<MainLayout><Kontakt /></MainLayout>} />
      {/*<Route path="/Postavke" component={<MainLayout><Postavke /></MainLayout>} />*/}
    </HashRouter>
  );
}


{/*
PRIMJENITI ZA BOLJI NACIN PRIJAVE TAKO KORISNIK ZAPRAVO IMA RACUN
Pogledati u https://github.com/tojaku/2024-4b/blob/main/sjiwp/supabase_integration
Treba implementirati registraciju, prijavu te odjavu korisnika pomogu supabase autentifikacije

import { Router, Route, A } from "@solidjs/router";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { Show } from "solid-js";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";

import TestFunction from "./pages/TestFunction";

export default function App() {
  return (
    <AuthProvider>
      <Router root={Layout}>
        <Route path="/" component={Home} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signout" component={SignOut} />
        <Route path="/test" component={TestFunction} />
      </Router>
    </AuthProvider>
  );
}

function Layout(props) {
  const appName = import.meta.env.VITE_APP_NAME;
  const session = useAuth();

  return (
    <div class="p-4 flex flex-col gap-4">

      <div class="flex flex-wrap align-top items-start gap-2">
        <div class="flex-1 text-3xl text-neutral-500 uppercase">
          {appName}
        </div>
        <div class="flex-none flex flex-wrap gap-2">
          <A href="/" class="bg-orange-400 p-2 rounded hover:bg-red-300">Naslovnica</A>
          <Show when={!session()}>
            <A href="/signin" class="bg-orange-400 p-2 rounded hover:bg-red-300">Prijava</A>
          </Show>
          <Show when={session()}>
            <A href="/signout" class="bg-orange-400 p-2 rounded hover:bg-red-300">Odjava</A>
          </Show>
        </div>
      </div>

      <div class="min-h-[75vh] w-10/12 mx-auto">
        {props.children}
      </div>

      <div class="text-center text-xs text-neutral-500">
        Sva prava pridržana {new Date().getFullYear()}. Obrtnička škola Koprivnica
      </div>
    </div>
  );
}
*/}