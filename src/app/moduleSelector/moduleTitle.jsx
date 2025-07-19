"use client";
import React from "react";

export default function ModuleTitle({title1, title2, subtitle1, subtitle2}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // horizontal centering
        alignItems: "center",     // vertical centering
        flexDirection: "column",
      }}
    >
      <div
        style={{
          // width: '96px', // 120px * 0.8
          color: "#1f3a60",
          fontSize: ".8vw",
          fontWeight: "bold",
          height: '17px',

        }}
      >
        {title1}
      </div>

      <div
        style={{
          // width: '96px',
          color: "#1f3a60",
          fontSize: ".8vw",
          fontWeight: "bold",
        }}
      >
        {title2}
      </div>

      <div
        style={{
          color: "#1f3a60",
          fontSize: ".6vw", // 14px * 0.8
        }}
      >
        {subtitle1}
      </div>

      <div
        style={{
          color: "#1f3a60",
          fontSize: ".6vw",
          fontWeight: "bold",
        }}
      >
        {subtitle2}
      </div>
    </div>
  );
}
