"use client";
import React from "react";

export default function ProgBar({progress, module}) {


const progWidth = (130 * (progress / 100))
console.log(progWidth)


  return (
<div
 style={{ position: 'relative', width: '200px', marginTop: '2px', marginLeft: '70px',}}
>

<div
style = {{
    position: 'absolute',
    height: '10px',
    width: '130px',
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
    height: '10px',
    width: `${progWidth}px`,
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