"use client";
import React from "react";

export default function DaProg({totalProgress}) {

const DaProgWidth = ((totalProgress / 1400) * 1000)

  return (
<div
 style={{ position: 'relative', width: '200px', marginTop: '50px', marginLeft: '70px',}}
>

<div
style = {{
    position: 'absolute',
    height: '15px',
    width: '730px',
    backgroundColor: '#184c94',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#00bfff',
    borderRadius: '10px',
    Zindex: '1',

}}
>
</div>

<div
style = {{
    position: 'absolute',
    height: '15px',
    width: `${DaProgWidth}px`,
    backgroundColor: '#00bfff',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#00bfff',
    borderRadius: '10px',
    Zindex: '2',

}}
>
</div>



</div>
  )}