"use client";
import React from 'react';
import { Highlighter, RotateCw, Lightbulb } from "lucide-react";

export default function Spreadbutt({
  refresh,
  setHighlightOn,
  setHintOn,
  highlightOn,
  hintOn,
}) {
  return (
    <div
      style={{
        height: '10vh',
        width: '50vw',
        backgroundColor: '#1f3a60',
        borderRadius: '0 0 10px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '1rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 'clamp(0.5rem, 2vw, 1rem)', // Scales gap with screen size
        }}
      >
        {[{
          onClick: () => setHighlightOn(prev => !prev),
          active: highlightOn,
          icon: <Highlighter size="clamp(1rem, 2vw, 1.5rem)" color="#FFFFFF" />
        },
        {
          onClick: refresh,
          active: false,
          icon: <RotateCw size="clamp(1rem, 2vw, 1.5rem)" color="#FFFFFF" />
        },
        {
          onClick: () => setHintOn(prev => !prev),
          active: hintOn,
          icon: <Lightbulb size="clamp(1rem, 2vw, 1.5rem)" color="#FFFFFF" />
        }].map(({ onClick, active, icon }, i) => (
          <button
            key={i}
            type="button"
            onClick={onClick}
            style={{
              backgroundColor: active ? '#64d8ff' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              width: 'clamp(2.5rem, 5vw, 3rem)', // Responsive width
              height: 'clamp(2.5rem, 5vw, 3rem)', // Responsive height
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={e => {
              if (!active) e.currentTarget.style.backgroundColor = '#297bbd';
            }}
            onMouseLeave={e => {
              if (!active) e.currentTarget.style.backgroundColor = '#3498db';
            }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
