"use client";
import React from "react";

export default function DaProg({highestStep, totalSteps,}) {

const DaProgWidth = ((highestStep / (totalSteps - 1))*52)
console.log("FUCK AAAAAAAHHHHHH",highestStep/totalSteps, highestStep, totalSteps)
  return (
<div
 style={{ position: 'relative', width: '20px', marginBottom: '2rem'}}
>

<div
style = {{
    position: 'absolute',
    height: '.9rem',
    width: '52rem',
    backgroundColor: '#184c94',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#00bfff',
    borderRadius: '10px',
    zIndex: '90',

}}

>
  
</div>

<div
style = {{
    position: 'absolute',
    height: '.9rem',
    width: `${DaProgWidth}rem`,
    backgroundColor: '#00bfff',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#00bfff',
    borderRadius: '10px',
    zIndex: '92',

}}
>
</div>



</div>
  )}