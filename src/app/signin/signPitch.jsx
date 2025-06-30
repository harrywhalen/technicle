"use client"           
import React, {useState} from 'react';


export default function SignPitch({createState, setCreateState, top, bottom}) {



  const handleClick = () => {
    setCreateState(prev => !prev); // toggles true/false
  };

return(
    <div
style={{
display: 'flex',
flexDirection: "column",
justifyContent: 'center',
alignItems: 'center',

    }}
    >
<div
    style={{

        color: '#1f3a60',
        cursor: 'pointer', // Hand cursor on hover
        fontWeight: 'bold',
        fontSize: '2.5em',
        zIndex: '5',
    }}

>

   {top}

</div>
<button
    onClick={handleClick}
    style={{

        color: '#00bfff',
        cursor: 'pointer', // Hand cursor on hover
        fontSize: '1.5em',
        zIndex: '5',
    }}

>

   or {bottom}

</button>
</div>



)}


