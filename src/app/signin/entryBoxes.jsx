"use client"
import React from 'react';
import Image from 'next/image';
import googleLogo from './googleLogo.png';

export default function EntryBoxes({top}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '25px',
      }}
    >

                    <div
        style={{
          height: '1px',
          width: '540px',
          backgroundColor: '#1f3a60',
          marginBottom: '25px',
        }}></div>

      <input
        placeholder="Email"
        style={{
          height: '70px',
          width: '500px',
          backgroundColor: '#ffffff',
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor: "#1f3a60",
          display: 'flex',
          alignItems: 'center',
          color: '#1f3a60',
          padding: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '25px',
        }}
      >
        
      </input>

      <input
       placeholder="Password"
       type = "password"
        style={{
          height: '70px',
          width: '500px',
          backgroundColor: '#ffffff',
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor: "#1f3a60",
          display: 'flex',
          alignItems: 'center',
          color: '#1f3a60',
          padding: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '25px',
        }}
      >
        
      </input>

            <div
        style={{
          height: '1px',
          width: '540px',
          backgroundColor: '#1f3a60',
          marginBottom: '25px',
        }}></div>

      <button
        style={{
          height: '70px',
          width: '500px',
          backgroundColor: '#00bfff',
          borderRadius: '10px',
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '1.5em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '25px',
        }}
      >
        {top}
      </button>

      <button
        style={{
          height: '70px',
          width: '500px',
          backgroundColor: '#ffffff',
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor: "#1f3a60",
          borderRadius: '10px',
          color: '#1f3a60',
          fontWeight: 'bold',
          fontSize: '1.5em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Image src={googleLogo} alt="Google logo" style={{ height: '28px',  width: '28px', marginRight: '20px',}} />
        Sign In With Google
      </button>

    </div>
  );
}
