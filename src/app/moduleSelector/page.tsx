import Image from "next/image";
import MS from "./moduleSelector.jsx";
import ModBox from "./moduleBox.jsx";
import NavBar from "./navBar.jsx";
import Bullshit from "./bullshit.jsx";
import Background from "./background.jsx";
import TBL from "./thinLine.jsx";
import Bottom from "./bottom.jsx";

export default function Home() {
  return (
    <div>
      <NavBar/>
       <Background/>
      <div
        style={{
        display: "flex",
        justifyContent: "center", // horizontal centering
        //alignItems: "center",     // vertical centering
        flexDirection: "column",
      }}
      >
        <Bullshit/>
        <TBL/>
        <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
        >
        <MS/>
        </div>
      
      </div>

    </div>
  );
}
