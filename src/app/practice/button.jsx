"use client"           
import React from 'react';
import { useRouter } from 'next/navigation';


export default function Button() {
const router = useRouter();
return(
<button
    style={{
        height: '6rem',
        width: '10rem',
        backgroundColor: '#00bfff', // Blue background for button
        color: 'white', // White text
        padding: '10px 25px', // Padding inside button
        borderWidth: "4px",      // 3px * 0.8
        borderStyle: "solid",
        borderColor: "#00a9e1",
        borderRadius: '1.5rem',
        cursor: 'pointer', // Hand cursor on hover
        fontSize: '1.5em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease', // Smooth transition on hover
        opacity: '1',
        zIndex: '5',
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#297bbd'} // Darker blue on hover
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00bfff'} // Original blue
>
    Submit
</button>



)}


