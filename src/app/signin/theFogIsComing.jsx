"use client";
import React from 'react';
import SignUp from "./signUp.jsx";
import PracticeNow from "./practiceNow.jsx";
import Pitch from "./pitch.jsx";

export default function TheFog() {

return(
<div
style = {{
height: '100vh',
width: '100vw',
backgroundColor: 'rgba(255, 255, 255, 0.85)', // ✅ fog effect without affecting children
zIndex: '1',
display: 'flex',
flexDirection: "column",
justifyContent: 'center',
alignItems: 'center',
}}>

<div
style = {{
display: 'flex',
flexDirection: 'column',
justifyContent: 'center',
alignItems: 'center',
}}
>
<SignUp />
</div>

</div>)}