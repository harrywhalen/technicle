"use client";
import React from 'react';

export default function FeedbackPLZ() {
  return (
    <div
      style={{
        height: '100px',
        width: '100%',
        backgroundColor: '#1f3a60',
        color: 'white',
        fontSize: '20px',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '10px',
      }}
    >

      <div
      style={{
        backgroundColor: '#1f3a60',
        color: 'white',
        fontSize: '20px',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        //gap: '20px',
    }}
      >
      We want your feedback!


        <input
          type="text"
            style={{
                height: '30px',
                width: '250px',
                backgroundColor: '#1f3a60',
                borderTop: '1px solid #ffffff',
                borderLeft: '1px solid #ffffff',
                borderRight: '1px solid ',
                borderBottom: '1px solid #ffffff',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                marginLeft: '20px',
            }}
        >

        </input>


        <button
            style={{
                height: '34px',
                width: '55px',
                backgroundColor: '#3498db',
                borderTop: '1px solid #ffffff',
                borderRight: '1px solid #ffffff',
                borderLeft: '1px solid #ffffff',
                borderBottom: '1px solid #ffffff',
                borderRadius: '0px 10px 10px 0px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            Send
        </button>


      </div>

      <div
      style={{
        backgroundColor: '#1f3a60',
        color: 'white',
        fontSize: '20px',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: '20px',
    }}
      >


        <div
            style={{
                height: '30px',
                color: 'white',
                fontSize: '14px',

            }}
        >
             What do you like and dislike?
        </div>

        
        <div
            style={{
                height: '30px',
                color: 'white',
                fontSize: '14px',

            }}
        >
             What do you want added or removed?
        </div>

      </div>



    </div>
  );
}
