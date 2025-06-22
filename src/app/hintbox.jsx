"use client";
import React from 'react';

export default function HintBox({ hintOn, setHintOn }) { // Now accepts a 'content' prop
        if (!hintOn) return null; // Don't render if hintOn is false
    return(
        <div
            style={{
                width: '400px', // Set to 300px for consistency with the right column in Big3
                marginTop: '30px',
                marginLeft: '0px',
                marginRight: '110px',
            }}
        >
            <div
                style={{
                    // Removed height: '100%' and fixed height to allow content to dictate height naturally.
                    height: '80px', // Maintain a minimum height for visual consistency
                    backgroundColor: '#ffffff',
                    borderColor: '#1f3a60',
                    borderWidth: '3px', // Changed to 3px to match QuizBox and other elements
                    borderStyle: 'solid',
                    color: '#1f3a60',
                    // Adjusted font size and weight to be more suitable for body text
                    fontSize: '0.95em', // Adjust font size relative to parent
                    fontWeight: 'normal', // Standard font weight for body text
                    lineHeight: '1.4', // Improved line spacing for readability
                    padding: '15px',
                    borderRadius: '10px',
                }}
            >
                {"Hint"} {/* Displays the content passed via prop */}
            </div>

        </div>
    );
}
