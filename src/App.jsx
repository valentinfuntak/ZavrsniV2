import 'flowbite';

import { HashRouter, Route } from "@solidjs/router";

import MainLayout from "./layouts/MainLayout";
import RegLogLayout from "./layouts/RegLogLayout";


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


