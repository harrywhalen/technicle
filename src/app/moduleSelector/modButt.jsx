"use client";
import React from "react";

export default function ModButt({butt_action, module}) {

  function getLabel(butt_action) {
  switch (butt_action) {
    case 1:
      return "Start";
    case 2:
      return "Complete";
    default:
      return "Continue";
  }
}

  return (
    <div
      style={{
        height: "40px", // 50px * 0.8
        width: "72px",  // 90px * 0.8
        backgroundColor: module.isUnlocked ? "#00bfff" : "#aaadae",
        borderWidth: "1.6px", // 2px * 0.8
        borderStyle: "solid",
        borderColor: module.isUnlocked ? "#00bfff" : "#aaadae",
        borderRadius: "12px", // 15px * 0.8
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "#ffffff",
        fontSize: "12.8px", // 16px * 0.8
        fontWeight: "bold",
        // marginTop: "8px",       // 10px * 0.8
        // marginLeft: "8.8em",    // 11em * 0.8
      }}
    >
      
  {getLabel(butt_action)}
    </div>
    
  );
}
