"use client";
import React from "react";

export default function Bullshit() {
  return (

<div
      style={{
        display: "flex",
        //justifyContent: "center",
        //alignItems: "center",
        flexDirection: "row",
        width: '1000px',
        gap: '10px',
        marginLeft: '250px',

      }}
>

        <div
      style={{
        display: "flex",
        flexDirection: "column",
        //justifyContent: "center",
        //alignItems: 'center',
        marginTop: "100px",
        width: '900px',
        height: '130px',
        gap: '55px',
      }}
    >
      <div
        style={{
          // width: '96px', // 120px * 0.8
          color: "#1f3a60",
          fontSize: "55px",
          fontWeight: "bold",
          height: '17px',
          marginTop: '10px',

        }}
      >
        Welcome back
      </div>
            <div
        style={{
          // width: '96px', // 120px * 0.8
          color: "#1f3a60",
          fontSize: "55px",
          //fontWeight: "bold",
          height: '17px',

        }}
      >
        0 Minutes Practiced Today
      </div>
    </div>

</div>


  );
}
