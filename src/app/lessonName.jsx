"use client";
import React from 'react';

export default function LessonName() {
  return (
    <div
      style={{
        height: '10vh', // 90px → rem
        width: '50vw', // 1000px → viewport-based width
        maxWidth: '62.5rem', // Limits it to 1000px max
        backgroundColor: '#ffffff',
        borderColor: '#1f3a60',
        borderWidth: '0.1875rem', // 3px → rem
        borderStyle: 'solid',
        borderRadius: '0.625rem', // 10px → rem
        boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.1)', // 4px 8px → rem
        color: '#1f3a60',
        fontSize: 'clamp(1.5rem, 3.5vw, 4.375rem)', // Responsive font size that scales with viewport
        fontWeight: 650,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '0.9375rem', // 15px → rem
        textAlign: 'center',

      }}
    >
      What is an Income Statement?
    </div>
  );
}