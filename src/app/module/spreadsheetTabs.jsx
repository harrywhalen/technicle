
"use client";
import React, { useState, useEffect } from "react";
import confetti from 'canvas-confetti';

const spreadsheetTabs = [
  { name: "Summary", id: "intro" },
  { name: "Income Statement", id: "inputs" },
  { name: "Balance Sheet", id: "projections" },
  { name: "Cash Flow Statement", id: "valuations" },
  { name: "Assumptions", id: "sensitivity" },
];

export default function SpreadsheetTabs({ initialActiveTab = "inputs", onTabChange, TargetTab, setNextReady, currentActiveStepId, tabLocked,}) {
  const [activeTab, setActiveTab] = useState(initialActiveTab);

    const triggerConfettiT = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6, x: 0.4 },
      colors: ['#1f3a60', '#8be2ff', '#28518d', '#00bfff'],
    });
  };

    const playCorrectSoundT = () => {
  const audio = new Audio("/sounds/correct.mp3");
  audio.play().catch(error => {
    console.error("Error playing sound:", error);
  });
};

const handleTabClick = (tabId) => {
  if (tabLocked === false) {
  setActiveTab(tabId);
  
  if (onTabChange) onTabChange(tabId);

  if (tabId === TargetTab) {
    setNextReady(true);
    playCorrectSoundT();
    triggerConfettiT();
  }
  }
};




  const [shimmerIntro, SetShimmerIntro] = useState(false);
  const [shimmerInputs, SetShimmerInputs] = useState(false);
  const [shimmerProj, SetShimmerProj] = useState(false);
  const [shimmerVal, SetShimmerVal] = useState(false);
  const [shimmerSens, setShimmerSens] = useState(false);
  const [shimmerTab, setShimmerTab] = useState(false);

    useEffect(() => {
    setNextReady(false);
    setShimmerTab(null);
  }, [currentActiveStepId]);

  useEffect(() => {
    if (TargetTab === 'valuations') {
      SetShimmerVal(true);
    }

    if (activeTab === 'valuations') {
      SetShimmerVal(false);
    }
  }, [TargetTab, activeTab]);


  useEffect(() => {
    if (shimmerIntro) setShimmerTab("intro");
    else if (shimmerInputs) setShimmerTab("inputs");
    else if (shimmerProj) setShimmerTab("projections");
    else if (shimmerVal) setShimmerTab("valuations");
    else if (shimmerSens) setShimmerTab("sensitivity");
    else setShimmerTab(null); // Reset if none are active
  }, [shimmerIntro, shimmerInputs, shimmerProj, shimmerVal, shimmerSens]);

  return (
    <>
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
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1f3a60",
          padding: "10px 20px",
          borderRadius: "8px 8px 0 0",
          width: "52.4vw",
          boxSizing: "border-box",
        }}
      >
        {spreadsheetTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={{
              width: "140px",
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: "0.83rem",
              fontWeight: activeTab === tab.id ? "bold" : "normal",
              color: "#ffffff",
              backgroundColor: activeTab === tab.id ? "#3498db" : "transparent",
              border: "1px solid #dcdcdc",
              borderBottom: activeTab === tab.id ? "1px solid #ffffff" : "1px solid #dcdcdc",
              borderRadius: "5px 5px 0 0",
              marginRight: "10px",
              transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
              position: "relative",
              top: activeTab === tab.id ? "1px" : "0",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = "#e6e6e6";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            {/* Shimmer - only for Projections tab */}
            {tab.id === shimmerTab && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-75%",
                  height: "100%",
                  width: "50%",
                  background: "linear-gradient(120deg, rgba(31, 58, 96,0.01) 0%, rgba(18, 95, 182, 0.44) 50%, rgba(31, 58, 96,0.01) 100%)",
                  transform: "skewX(-20deg)",
                  animation: "shimmer 2s infinite",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
            )}

            {/* Text on top */}
            <div style={{ position: "relative", zIndex: 1 }}>{tab.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}