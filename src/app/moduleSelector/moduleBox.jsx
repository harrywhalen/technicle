"use client";
import React from "react";
import ModuleTitle from "./moduleTitle.jsx";
import ModButt from "./modButt.jsx";
import ProgBar from "./progBar.jsx";


export default function ModBox({butt_action, module, title1, title2, subtitle1, subtitle2}) {
  return (

    
    <div
      style={{
        height: "17vh",           // 200px * 0.8
        width: "8.5vw",            // 200px * 0.8
        backgroundColor: "#FFFFFF",
        borderWidth: "2.4px",      // 3px * 0.8
        borderStyle: "solid",
        borderColor: "#184c94",
        borderRadius: "24px",      // 30px * 0.8
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: "6.4px",              // 8px * 0.8
        marginTop: "16px",         // 20px * 0.8
        marginLeft: "1.6vw",        // 20px * 0.8
        zIndex: '5',
      }}
    >
      <ModuleTitle 
      title1 = {title1}
      title2 = {title2}
      subtitle1 = {subtitle1}
      subtitle2 = {subtitle2}
      />

      <div
        style={{
          height: ".25vh",          // 3px * 0.8
          width: "8.5vw",         // 196px * 0.8
          backgroundColor: "#184c94",
        }}
      ></div>

      <ModButt 
      butt_action = {butt_action}
      module = {module}

      />

      <ProgBar
            progress={module.progress}
            module = {module}
      />
    </div>
  );
}
