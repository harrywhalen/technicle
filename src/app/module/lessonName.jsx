"use client";
import React from 'react';

export default function LessonName({content}) {
  return (
    <div
      style={{
        height: '6rem', // 90px → rem
        //width: '90vw', // 1000px → viewport-based width
        maxWidth: '52vw', // Limits it to 1000px max
        backgroundColor: '#ffffff',
        borderColor: '#1f3a60',
        borderWidth: '0.1875rem', // 3px → rem
        borderStyle: 'solid',
        borderRadius: '0.625rem', // 10px → rem
        boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.1)', // 4px 8px → rem
        color: '#1f3a60',
        fontSize: '3.4rem', // 70px → rem (you may want to scale this down for smaller screens)
        fontWeight: 650,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1rem', // 15px → rem
        textAlign: 'center',
        padding: '0rem 1rem 0rem 1rem',
      }}
    >
      <p>{content["1"].name}</p>
    </div>
  );
}
