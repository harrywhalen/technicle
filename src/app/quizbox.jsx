"use client";
import React, { useState, useEffect } from "react";

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
  tempBS,
}) {
  const [isWiggling, setIsWiggling] = useState(false);

  useEffect(() => {
    if (tempBS) {
      setIsWiggling(true);
      const timer = setTimeout(() => setIsWiggling(false), 500);
      return () => clearTimeout(timer);
    }
  }, [tempBS]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div
      style={{
        flex: 1, // Takes equal space with TextBox
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0, // Allows flex item to shrink below content size
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% { left: -75%; }
          100% { left: 125%; }
        }
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-10px); }
          30% { transform: translateX(10px); }
          45% { transform: translateX(-10px); }
          60% { transform: translateX(0px); }
        }
      `}</style>

      <div
        style={{
          flex: 1,
          animation: isWiggling ? "wiggle 1s ease-in-out" : "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            border: "3px solid #1f3a60",
            color: "#1f3a60",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px 10px 0 0",
            padding: "1rem",
            boxSizing: "border-box",
            fontSize: "clamp(0.8rem, 1.2vw, 1.2rem)",
          }}
        >
          <h4 style={{ 
            textAlign: "center", 
            marginBottom: "1rem", 
            margin: "0 0 1rem 0",
            fontSize: "clamp(0.9rem, 1.3vw, 1.3rem)" // Slightly larger for heading
          }}>
            {question || "No quiz question provided."}
          </h4>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: "0.8rem",
              overflowY: "auto",
              minHeight: 0, // Allows scrolling when needed
            }}
          >
            {Qtype === "MCQ" && options && options.length > 0 ? (
              options.map((option, index) => (
                <label
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "clamp(0.8rem, 1.1vw, 1.1rem)",
                    gap: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="dcf_quiz_option"
                    value={option}
                    checked={selectedOption === option}
                    onChange={handleOptionChange}
                    style={{
                      transform: "scale(1.3)",
                      cursor: "pointer",
                    }}
                  />
                  {option}
                </label>
              ))
            ) : Qtype === "MCQ" ? (
              <p style={{ fontSize: "clamp(0.7rem, 1vw, 1rem)", color: "#888" }}>
                No options available for this quiz.
              </p>
            ) : null}
          </div>

          {(Qtype === "MCQ" || Qtype === "cells" || nextReady) && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
              <button
                type="submit"
                onClick={nextReady ? advanceStep : handleSubmit}
                style={{
                  backgroundColor: nextReady ? "#00bfff" : "#3498db",
                  color: "white",
                  padding: "clamp(8px, 1vw, 12px) clamp(16px, 2vw, 24px)",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "clamp(0.9rem, 1.2vw, 1.2rem)",
                  fontWeight: "bold",
                  position: "relative",
                  height: "clamp(40px, 6vw, 55px)",
                  width: "clamp(100px, 15vw, 120px)",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#297bbd")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = nextReady
                    ? "#00bfff"
                    : "#3498db")
                }
              >
                {nextReady ? "Next" : "Submit"}
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
            </div>
          )}
        </div>

        <div
          style={{
            height: "5px",
            borderRadius: "0 0 15px 15px",
            backgroundColor: "#1f3a60",
          }}
        />
      </div>
    </div>
  );
}