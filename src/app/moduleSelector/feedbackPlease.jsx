"use client";
import React from 'react';

export default function FeedbackPLZ() {
  return (
    <div
      style={{
        padding: '2rem 1rem',
        width: '100vw',
        backgroundColor: '#1f3a60',
        color: 'white',
        fontSize: '1.25rem', // 20px
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span
        style={{
          marginRight: '1rem',
        }}
        >We want your feedback!</span>

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
        }}
      >
        <span>What do you like and dislike?</span>
        <span>What do you want added or removed?</span>
      </div>
    </div>
  );
}
