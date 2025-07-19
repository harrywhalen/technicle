"use client";
import React from "react";

export default function ProgBar({progress, module}) {


const progWidth = (130 * (progress / 1000))
console.log(progWidth)


  return (
<div
 style={{ position: 'relative', width: '10vw', marginTop: '2px', marginLeft: '3.5vw',}}
>

<div
style = {{
    position: 'absolute',
    height: '1.1vh',
    width: '6.5vw',
    backgroundColor: '#184c94',
    borderWidth: '2px',
    borderStyle: 'solid',
    //borderColor: '#00bfff',
    borderColor: module.isUnlocked ? "#00bfff" : "#aaadae",
    borderRadius: '10px',
    Zindex: '1',

}}
>
</div>

<div
style = {{
    position: 'absolute',
    height: '1.1vh',
    width: `${progWidth}%`,
    backgroundColor: module.isUnlocked ? "#00bfff" : "#aaadae",
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: module.isUnlocked ? "#00bfff" : "#aaadae",
    borderRadius: '10px',
    Zindex: '2',

}}
>
</div>



</div>

  )}