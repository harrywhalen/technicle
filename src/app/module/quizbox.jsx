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
  wiggleTime,
}) {
  const [isWiggling, setIsWiggling] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (wiggleTime && mounted) {
      setIsWiggling(true);
      const timer = setTimeout(() => setIsWiggling(false), 500);
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
          width: "25rem",
          animation: isWiggling ? "wiggle 1s ease-in-out" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            borderColor: "#1f3a60",
            borderWidth: "0.2rem",
            borderStyle: "solid",
            color: "#1f3a60",
            boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)",
            borderRadius: "1rem 1rem 0rem 0rem",
            padding: "0rem 1rem 0rem 1rem",
            marginTop: "1rem",
          }}
        >
          <h4 style={{ fontSize: "1.3rem", textAlign: "center", height: "2rem" }}>
            {question || "No quiz question provided."}
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "0rem 1.5rem 1.3rem 1.5rem",
            }}
          >
            {Qtype === "MCQ" && options && options.length > 0 ? (
              options.map((option, index) => (
                <label key={index} style={{ fontSize: "1rem", margin: ".5rem 0" }}>
                  <input
                    type="radio"
                    name="dcf_quiz_option"
                    value={option}
                    checked={selectedOption === option}
                    onChange={handleOptionChange}
                    style={{
                      marginRight: "0.6rem",
                      transform: "scale(1.2)",
                    }}
                  />
                  {option}
                </label>
              ))
            ) : Qtype === "MCQ" ? (
              <p style={{ fontSize: "1rem", color: "#888" }}>
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
                    padding: "0.625rem 1.25rem",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    display: "block",
                    marginTop: ".5rem",
                    transition: "background-color 0.3s ease",
                    position: "relative",
                    height: "3rem",
                    width: "7rem",
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

        <div
          style={{
            height: "0.2rem",
            borderRadius: "0rem 0rem 1rem 1rem",
            backgroundColor: "#1f3a60",
          }}
        />
      </div>
    </div>
  );
}
