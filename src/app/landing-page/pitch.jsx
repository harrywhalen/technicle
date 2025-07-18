"use client"           
import React from 'react';


export default function Pitch() {
return(
    <div
style={{
display: 'flex',
flexDirection: "column",
justifyContent: 'center',
alignItems: 'center',
marginBottom: '150px'

    }}
    >
<div
style={{
display: 'flex',
flexDirection: "row",
justifyContent: 'center',
alignItems: 'center',
gap: '10px',
    }}
>
<div
    style={{

        color: '#456da6',
        cursor: 'pointer', // Hand cursor on hover
        fontSize: '4em',
        zIndex: '5',
    }}

>

   Learn Financial Modeling

</div>
<div
    style={{

        color: '#456da6',
        cursor: 'pointer', // Hand cursor on hover
        fontSize: '4em',
        fontWeight: 'bold',
        zIndex: '5',
    }}

>

   Hands On

</div>
</div>


<div
    style={{

        color: '#456da6',
        cursor: 'pointer', // Hand cursor on hover
        fontSize: '4em',
        fontWeight: 'bold',
        zIndex: '5',
    }}

>

   For free

</div>
    </div>



)}


