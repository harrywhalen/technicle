"use client";
import React from "react";
import ModuleTitle from "./moduleTitle.jsx";
import ModBox from "./moduleBox.jsx";
import ProgBar from "./progBar.jsx";


export default function ModGrid ({modules}) {

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {[0, 1].map((rowIndex) => (
        <div key={rowIndex} style={{ display: "flex", flexDirection: "row" }}>
          {modules.slice(rowIndex * 7, rowIndex * 7 + 7).map((mod) => {
            let butt_action;
            if (mod.progress === 0) {
              butt_action = 1;
            } else if (mod.progress === 100) {
              butt_action = 2;
            } else {
              butt_action = 3;
            }

            return (
              <ModBox
                key={mod.id}
                butt_action={butt_action}
                module={mod}
                title1={mod.title1}
                title2={mod.title2}
                subtitle1={mod.subtitle1}
                subtitle2={mod.subtitle2}
                
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}