"use client";
import React from "react";

export default function Bullshit() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "75vw",           // 1000px → 75% of viewport width
        gap: "0.75rem",          // 10px → 0.75rem
        marginLeft: "18.75vw",   // 250px → 18.75vw
        marginTop: "3.75vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "6.25vh",     // 100px → 6.25% of viewport height
          width: "67.5vw",         // 900px → 67.5% of viewport width
          height: "9.75vh",        // 130px → 9.75% of viewport height
          gap: "2.0625rem",        // 55px → 2.0625rem
        }}
      >
        <div
          style={{
            color: "#1f3a60",
            fontSize: "2.75rem",     // 55px → 2.75rem
            fontWeight: "bold",
            height: "1.275vh",       // 17px → 1.275vh
            marginTop: "0.625rem",   // 10px → 0.625rem
          }}
        >
          Welcome back
        </div>
        <div
          style={{
            color: "#1f3a60",
            fontSize: "2.75rem",     // 55px → 2.75rem
            height: "1.275vh",       // 17px → 1.275vh
          }}
        >
          0 Minutes Practiced Today
        </div>
      </div>
    </div>
  );
}
