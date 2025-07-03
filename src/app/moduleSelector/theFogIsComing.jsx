"use client";
import React from 'react';

export default function TheFog() {

return(
<div
style = {{
height: '100vh',
width: '100vw',
backgroundColor: 'rgba(255, 255, 255, 0.85)', // ✅ fog effect without affecting children
zIndex: '-1',
position: 'absolute',
}}>
</div>)}