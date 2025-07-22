"use client";
import React from 'react';

export default function TextBox({ content, content2, contentBOLD }) { // Now accepts a 'content' prop
    return(
        <div
            style={{
                width: '26vw' // Set to 300px for consistency with the right column in Big3
            }}
        >
            <div
                style={{
                    // Removed height: '100%' and fixed height to allow content to dictate height naturally.
                    height: '100%', // Maintain a minimum height for visual consistency
                    backgroundColor: '#ffffff',
                    borderColor: '#1f3a60',
                    borderWidth: '.2rem' , // Changed to 3px to match QuizBox and other elements
                    borderStyle: 'solid',
                    color: '#1f3a60',
                    // Adjusted font size and weight to be more suitable for body text
                    fontSize: '1.15rem', // Adjust font size relative to parent
                    fontWeight: 'normal', // Standard font weight for body text
                    lineHeight: '1.4', // Improved line spacing for readability
                    padding: '15px',
                    borderRadius: '1rem',
                }}
            >
                {content} <strong>{contentBOLD}</strong> {content2}
            </div>

        </div>
    );
}
