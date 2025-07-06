"use client";
import React, { useState } from 'react';

export default function QuizBox({
  question,
  options,
  correctAnswer,
  isCorrect,
  setIsCorrect,
  handleSubmit,
  selectedOption,
  setSelectedOption,
  Qtype,
  nextReady,
  setNextReady,
  advanceStep,
}) {


  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <style>
        {`
          @keyframes shimmer {
            0% {
              left: -75%;
            }
            100% {
              left: 125%;
            }
          }
        `}
      </style>

      <div
        style={{
          width: '350px',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            borderColor: '#1f3a60',
            borderWidth: '3px',
            borderStyle: 'solid',
            color: '#1f3a60',
            padding: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px 10px 0px 0px',
          }}
        >
          <h4 style={{ fontSize: '1.5em' }}>
            {question || "No quiz question provided."}
          </h4>

          {Qtype === "MCQ" && options && options.length > 0 ? (
            options.map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="dcf_quiz_option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                  style={{ marginRight: '8px', fontSize: '1.1em' }}
                />
                {option}
              </label>
            ))
          ) : Qtype === "MCQ" ? (
            <p style={{ fontSize: '0.9em', color: '#888' }}>
              No options available for this quiz.
            </p>
          ) : null}

          {(Qtype === "MCQ" || Qtype === "cells" || nextReady) && (
            <button
              type="submit"
              onClick={nextReady ? advanceStep : handleSubmit}
              style={{
                backgroundColor: nextReady ? '#00bfff' : '#3498db',
                color: 'white',
                padding: '10px 25px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1em',
                fontWeight: 'bold',
                display: 'block',
                marginTop: '15px',
                transition: 'background-color 0.3s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#297bbd')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =  nextReady ? '#00bfff' : '#3498db')
              }
            >
              {nextReady ? 'Next' : 'Submit'}

              {nextReady && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-75%",
                    height: "100%",
                    width: "50%",
                    background:
                      "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)",
                    transform: "skewX(-20deg)",
                    animation: "shimmer 2s infinite",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
              )}
            </button>
          )}
        </div>

        {/* Bottom status line */}
        <div
          style={{
            height: '3px',
            borderRadius: '0px 0px 15px 15px',
            backgroundColor: '#1f3a60',
          }}
        />
      </div>
    </div>
  );
}
