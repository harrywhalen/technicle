"use client";
import React from 'react';

export default function TextBox({ content }) { // Now accepts a 'content' prop
    return(
        <div
            style={{
                width: '300px', // Set to 300px for consistency with the right column in Big3
            }}
        >
            <div
                style={{
                    padding: '15px',
                }}
            >
                {content || "No content provided."} {/* Displays the content passed via prop */}
            </div>
            </div>
    );
}
