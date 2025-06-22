"use client";
import React, { useState, useEffect } from 'react';
import { BookOpen, Highlighter, RotateCw, Lightbulb } from "lucide-react";

export default function Spreadbutt({refresh, data, setData, highlightOn, setHighlightOn, hintOn, setHintOn, }) {


    return(
    <div
    style = {{
        height: '70px',
        width: '1006px',
        backgroundColor: '#1f3a60',
        borderRadius: '0px 0px 10px 10px',

    }}>

        <div
        style = {{
        height: '50px',
        display: 'flex',
        marginLeft: '800px',
        marginTop: '8px',
        //width: '10px',
    }}>

        <button
        type = "button"
            onClick={() => setHighlightOn(prev => !prev)}
        style={{
            backgroundColor: highlightOn ? '#64d8ff' : '#3498db', // Blue if ON, Gray if OFF
            color: 'white', // White text
            border: 'none', // No border
            borderRadius: '50%', // Rounded corners for button
            cursor: 'pointer', // Hand cursor on hover
            fontSize: '1em',
            fontWeight: 'bold',
            display: 'block', // Make button a block element
            margin: '0 auto', // Center the button horizontally
            transition: 'background-color 0.3s ease', // Smooth transition on hover
            width: '50px',
        }}
        //onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#297bbd'} // Darker blue on hover
        //onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3498db'} // Original blue
    >

            <Highlighter color="#FFFFFF" size={24} />

    </button>

        <button
        type = "button"
            onClick={refresh}
        style={{
            backgroundColor: '#3498db', // Blue background for button
            color: 'white', // White text
            border: 'none', // No border
            borderRadius: '50%', // Rounded corners for button
            cursor: 'pointer', // Hand cursor on hover
            fontSize: '1em',
            fontWeight: 'bold',
            display: 'block', // Make button a block element
            margin: '0 auto', // Center the button horizontally
            transition: 'background-color 0.3s ease', // Smooth transition on hover
            width: '50px',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#297bbd'} // Darker blue on hover
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3498db'} // Original blue
    >
    <RotateCw color="#FFFFFF" size={24} />
    </button>

        <button
        type = "button"
            onClick={() => setHintOn(prev => !prev)}
        style={{
            backgroundColor: hintOn ? '#64d8ff' : '#3498db', // Blue if ON, Gray if OFF
            color: 'white', // White text
            border: 'none', // No border
            borderRadius: '50%', // Rounded corners for button
            cursor: 'pointer', // Hand cursor on hover
            fontSize: '1em',
            fontWeight: 'bold',
            display: 'block', // Make button a block element
            margin: '0 auto', // Center the button horizontally
            transition: 'background-color 0.3s ease', // Smooth transition on hover
            width: '50px',
        }}

    >
    <Lightbulb color="#FFFFFF" size={24} />
    </button>

        </div>


    
    </div>
    )

}