"use client"           
import React from 'react';
import { useRouter } from 'next/navigation';


export default function PracticeNow() {
const router = useRouter();
return(
<div>

<button
onClick={() => router.push('/moduleSelector')}
 style={{
        height: '150px',
        width: '250px',
        backgroundColor: '#456da6', // Blue background for button
        color: 'white', // White text
        padding: '10px 25px', // Padding inside button
        borderWidth: "4px",      // 3px * 0.8
        borderStyle: "solid",
        borderColor: "#1f3a60",     // 30px * 0.8
        borderRadius: '50px',
        cursor: 'pointer', // Hand cursor on hover
        fontSize: '1.5em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease', // Smooth transition on hover
        opacity: '1',
        zIndex: '5',
        marginTop: '15px',    
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#163e5fff'} // Darker blue on hover
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#456da6'} // Original blue
>
    Practice Now
</button>

</div>


)}


