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
  wiggleTime, // <-- Expect this prop controlling wiggle
}) {
  const [isWiggling, setIsWiggling] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);


  useEffect(() => {
    if (wiggleTime && mounted) {
      setIsWiggling(true);
      const timer = setTimeout(() => setIsWiggling(false), 500); // wiggle for 1 sec
      return () => clearTimeout(timer);
    }
  }, [wiggleTime]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
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
          width: "450px",
          animation: isWiggling ? "wiggle 1s ease-in-out" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            borderColor: "#1f3a60",
            borderWidth: "3px",
            borderStyle: "solid",
            color: "#1f3a60",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px 10px 0px 0px",
            padding: "0px 15px 0px 15px",
            marginTop: '5vh',
          }}
          
        >
          <h4 style={{ fontSize: "1.5em", textAlign: "center", height: "40px" }}>
            {question || "No quiz question provided."}
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "0px 40px 15px 40px",
            }}
          >
            {Qtype === "MCQ" && options && options.length > 0 ? (
              options.map((option, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name="dcf_quiz_option"
                    value={option}
                    checked={selectedOption === option}
                    onChange={handleOptionChange}
                    style={{
                      marginRight: "10px",
                      transform: "scale(1.4)",
                      fontSize: "1.1em",
                      marginTop: "2.1vh",
                    }}
                  />
                  {option}
                </label>
              ))
            ) : Qtype === "MCQ" ? (
              <p style={{ fontSize: "0.9em", color: "#888" }}>
                No options available for this quiz.
              </p>
            ) : null}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {(Qtype === "MCQ" || Qtype === "cells" || nextReady) && (
                <button
                  type="submit"
                  onClick={nextReady ? advanceStep : handleSubmit}
                  style={{
                    backgroundColor: nextReady ? "#00bfff" : "#3498db",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "1.2em",
                    fontWeight: "bold",
                    display: "block",
                    marginTop: "25px",
                    transition: "background-color 0.3s ease",
                    position: "relative",
                    height: "6vh",
                    width: "6vw",
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
              )}
            </div>
          </div>
        </div>

        {/* Bottom status line */}
        <div
          style={{
            height: "3px",
            borderRadius: "0px 0px 15px 15px",
            backgroundColor: "#1f3a60",
          }}
        />
      </div>
    </div>
  );
}
