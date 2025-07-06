"use client";

import React, { useState } from "react";
import Module from "./module.jsx";
import ModComplete from "./moduleComplete.jsx";
import Navbar from "./navBar.jsx";
import InitUser from "./InitUser";

export default function Home() {
  const [modDone, setModDone] = useState(false);

  return (
    <div>
      <Navbar />
      {modDone && <ModComplete setModDone={setModDone}/>}
      <Module setModDone={setModDone} />
    </div>
  );
}
