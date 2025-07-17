"use client";
import React from 'react';

export default function TextBox({ content }) {
    return (
        <div
            style={{
                flex: 1, // Takes equal space with QuizBox
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0, // Allows flex item to shrink below content size
            }}
        >
            <div
                style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    borderColor: '#1f3a60',
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    color: '#1f3a60',
                    fontSize: 'clamp(0.5rem, 2vw, 1.5rem)', // Responsive font size that scales well
                    fontWeight: 'normal',
                    lineHeight: '1.4',
                    padding: '1rem',
                    borderRadius: '10px',
                    boxSizing: 'border-box',
                    overflowY: 'auto', // Allows scrolling if content is too long
                    display: 'flex',
                    alignItems: 'flex-start', // Align content to top
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Match QuizBox shadow
                    wordWrap: 'break-word',
                    hyphens: 'auto',
                }}
            >
                <div style={{ width: '100%' }}>
                    {content || "No content provided."}
                </div>
            </div>
        </div>
    );
}