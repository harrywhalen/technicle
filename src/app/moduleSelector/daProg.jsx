"use client";
import React from "react";

export default function DaProg({totalProgress}) {

const DaProgWidth = ((totalProgress / 1400) * 100)

  return (
<div
 style={{ position: 'relative', width: '45%', marginTop: '50px', marginLeft: '2%', marginRight: '2%',}}
>

<div
style = {{
    position: 'absolute',
    height: '1.6vh',
    width: '100%',
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
    height: '1.6vh',
    width: `${DaProgWidth}%`,
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