"use client"

import React, { useState } from "react"; // fix capitalization and add useState
import Module from "./module.jsx";
import ModComplete from "./moduleComplete.jsx";
import Navbar from "./navBar.jsx";
import InitUser from "./InitUser";



export default function Home() {

  const [modDone, setModDone] = useState(false); // moved inside function and fixed casing

  return (
    <div>
    <Navbar />
    {modDone ? <ModComplete /> : null}
    <Module/>
    </div>

  );
}
