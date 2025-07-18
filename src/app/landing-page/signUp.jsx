"use client"           
import React from 'react';
import { useRouter } from 'next/navigation';


export default function SignUp() {
const router = useRouter();
return(
<div
style={{
display: 'flex',
flexDirection: "column",
justifyContent: 'center',
alignItems: 'center',
gap: '15px',

    }}
>

<button
    onClick={() => router.push('/signin')}
    style={{
        height: '150px',
        width: '250px',
        backgroundColor: '#00bfff', // Blue background for button
        color: 'white', // White text
        padding: '10px 25px', // Padding inside button
        borderWidth: "4px",      // 3px * 0.8
        borderStyle: "solid",
        borderColor: "#00a9e1",
        borderRadius: "24px",      // 30px * 0.8
        borderRadius: '50px',
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
    Sign Up
</button>

<div
    style={{

        color: '#456da6',
        cursor: 'pointer', // Hand cursor on hover
        fontSize: '1.5em',
        zIndex: '5',
        fontWeight: 'bold',
    }}

>

 OR

</div>

</div>


)}


