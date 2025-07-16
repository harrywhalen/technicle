"use client";
import React from 'react';

export default function FeedbackPLZ() {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '5vh', // Minimum height to match your request
        backgroundColor: '#1f3a60',
        color: 'white',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxSizing: 'border-box',
        padding: '1rem',
        overflow: 'visible',
        flexShrink: 0, // Prevent it from being squished
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <span style={{ marginRight: '1rem' }}>
          We want your feedback!
        </span>

        <input
          type="text"
          style={{
            flex: '1 1 250px',
            maxWidth: '300px',
            padding: '0.5rem',
            backgroundColor: '#1f3a60',
            border: '1px solid #ffffff',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            borderRadius: '0.5rem 0 0 0.5rem',
            minWidth: '100px',
          }}
        />

        <button
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3498db',
            border: '1px solid #ffffff',
            borderRadius: '0 0.5rem 0.5rem 0',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          fontSize: '0.875rem',
          fontWeight: 'normal',
          textAlign: 'center',
        }}
      >
        <span>What do you like and dislike?</span>
        <span>What do you want added or removed?</span>
      </div>
    </div>
  );
}
