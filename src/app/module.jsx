"use client";
import React, { useState, useEffect, useRef, useMemo  } from 'react';
import Sidebar from "./sidebar.jsx";
import LessonName from "./lessonName.jsx";
import Big3 from "./big3.jsx";
import lessonData from "./data/lessondata.json"; // Import the JSON file
import { useSpreadsheetValidator } from './hooks/useSpreadsheetValidator';
import confetti from 'canvas-confetti';

export default function Module({setModDone}) {


  const [nextReady, setNextReady] = useState(false);

  const spreadGangRef = useRef(null);

  const [highlightOn, setHighlightOn] = useState(false);
  const [hintOn, setHintOn] = useState(false);

  const [currentActiveStepId, setCurrentActiveStepId] = useState(1);
  const [currentStepContent, setCurrentStepContent] = useState(lessonData['1']);

  const [isCorrect, setIsCorrect] = useState(null); // null = no answer yet, true/false = result
  const [selectedOption, setSelectedOption] = useState("Discounted Cash Flow");

  const correctAnswer = currentStepContent?.quiz.correctAnswer;

  const hotTableComponent = useRef(null);
const { setCurrentSheet } = useSpreadsheetValidator(hotTableComponent);

  const highestStepIdRef = useRef(1);
  const TweakerStep = useRef(1);

  const totalSteps = useMemo(() => Object.keys(lessonData).length, []);

  const [tabLocked, setTabLocked] = useState(true);


useEffect(() => {
  console.log("== useEffect ==");
  console.log("Before check: highest =", highestStepIdRef.current, "current =", currentActiveStepId);

  if (currentActiveStepId >= highestStepIdRef.current) {
    console.log("Updating highest step to:", currentActiveStepId);
    highestStepIdRef.current = currentActiveStepId;

  } else console.log("Already higher step reached, current:", currentActiveStepId, "highest:", highestStepIdRef.current);
}, [currentActiveStepId]);

function columnToLetter(col) {
  let temp = '';
  let letter = '';
  while (col >= 0) {
    temp = String.fromCharCode((col % 26) + 65);
    letter = temp + letter;
    col = Math.floor(col / 26) - 1;
  }
  return letter;
}

const showCoordinates = () => {
  console.log("showCoordinates triggered");

  const hot = hotTableComponent.current?.hotInstance;
  if (!hot) {
    console.warn("hotInstance not found");
    return;
  }

  const rowCount = hot.countRows();
  const colCount = hot.countCols();

  const newData = Array.from({ length: rowCount }, (_, rowIndex) =>
    Array.from({ length: colCount }, (_, colIndex) => {
      const colLetter = columnToLetter(colIndex);
      const rowNumber = rowIndex + 1;
      return `${colLetter}${rowNumber}`;
    })
  );

  console.log("Generated coordinate data", newData);

  setSheetsDisplayData(prev => ({
    ...prev,
    [activeTab]: newData
  }));
};

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.8, x: 0.8 },
      colors: ['#1f3a60', '#8be2ff', '#28518d', '#00bfff'],
  });
};

  const [tempBS, setTempBS] = useState(false);

  // Example: trigger wiggle when something happens, e.g., on button click
  const triggerWiggle = () => {
    setTempBS(true);
    setIsCorrect(null);
    // Optionally reset tempBS after a bit if needed
    setTimeout(() => setTempBS(false), 1100); // just to keep consistent
  };

  const playCorrectSoundMCQ = () => {
    const audio = new Audio("/sounds/correct.mp3");
    audio.play().catch(error => {
      console.error("Error playing sound:", error);
    });
  };

      const playWrongSoundMCQ = () => {
  const audio = new Audio("/sounds/wrong.mp3");
  setIsCorrect(null);
  audio.play().catch(error => {
    console.error("Error playing sound:", error);
  });
};

const playComplete = () => {
  setTimeout(() => {
    const audio = new Audio("/sounds/complete.mp3");
    audio.play().catch(error => {
      console.error("Error playing sound:", error);
    });
  }, 200); // 250 milliseconds = 0.25 seconds
};

const handleCheckAnswers = () => {
  if (spreadGangRef.current) {
    spreadGangRef.current.checkAllAnswers();
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  console.log("LOOKY HERE", highestStepIdRef.current, currentActiveStepId)
    setIsCorrect(null);
  
  if (Qtype === "MCQ") {
    const result = selectedOption === correctAnswer;
    setIsCorrect(result);

    setTimeout(() => setIsCorrect(result), 10);
  } else {
    handleCheckAnswers();
  }
};

let Qtype = currentStepContent?.Qtype
let TargetTab = currentStepContent?.targetTab

const sheetQuizCells = useMemo(() => {
  if (Qtype !== "cells") {
    return {
      intro: [],
      inputs: [],
      projections: [],
      valuations: [],
      sensitivity: []
    };
  }

  const result = {
    intro: [],
    inputs: [],
    projections: [],
    valuations: [],
    sensitivity: []
  };

  const tabsToInclude = new Set();

  if (currentStepContent?.Quizcel_1?.tab)
    tabsToInclude.add(currentStepContent.Quizcel_1.tab);

  for (const tab of tabsToInclude) {
    result[tab] = [];
  }

for (let i = 1; i <= 6; i++) {
  const quizCel = currentStepContent[`Quizcel_${i}`];
  if (quizCel) {
    const { tab, row, column } = quizCel;
    result[tab]?.push({ row, col: column });
  }
}

  return result;
}, [currentStepContent, Qtype]);


const sheetBlankCells = useMemo(() => {
  const result = {
    intro: [],
    inputs: [],
    projections: [],
    valuations: [],
    sensitivity: []
  };

  for (let i = 1; i <= 100; i++) {
    const blankCel = currentStepContent[`Blankcel_${i}`];
    if (blankCel?.tab) {
      result[blankCel.tab] ??= [];
      result[blankCel.tab].push({
        row: blankCel.row,
        col: blankCel.column
      });
    }
  }

  return result;
}, [currentStepContent]);

const sheetBlankForecasts = useMemo(() => {
  const result = {
    intro: [],
    inputs: [],
    projections: [],
    valuations: [],
    sensitivity: []
  };

  for (let i = 1; i <= 100; i++) {
    const BlankFOR = currentStepContent[`BlankFOR_${i}`];
    if (!BlankFOR?.tab) continue;

    result[BlankFOR.tab] ??= [];

for (let c = BlankFOR.column; c <= 9; c++) {
  result[BlankFOR.tab].push({
    row: BlankFOR.row,
    col: c
  });
}
  }

  return result;
}, [currentStepContent]);

useEffect(() => {
  console.log("sheetBlankForecasts:", sheetBlankForecasts);
}, [sheetBlankForecasts]);



      

          // Current active tab state
    const [activeTab, setActiveTab] = useState('inputs');

        // Data for each sheet
        const [sheetsData, setSheetsData] = useState({
            intro: [],
            inputs: [],
            projections: [],
            valuations: [],
            sensitivity: []
        });
        
        const [sheetsInitialData, setSheetsInitialData] = useState({
            intro: [],
            inputs: [],
            projections: [],
            valuations: [],
            sensitivity: []
        });
        
        const [sheetsDisplayData, setSheetsDisplayData] = useState({
            intro: [],
            inputs: [],
            projections: [],
            valuations: [],
            sensitivity: []
        });

          // Handle tab changes
    const handleTabChange = (newTabId) => {
      if (tabLocked === false) {
        setActiveTab(newTabId);
        setCurrentSheet(newTabId); // Update validator's current sheet
        console.log(`Switched to ${newTabId} sheet`);
        console.log(`Data for ${newTabId}:`, sheetsDisplayData[newTabId]);
      }

    };

      const refresh = () => {
        console.log("bithc", sheetBlankForecasts.inputs);
        // Reset current sheet to initial display data (with quiz cells empty)
        const quizCells = sheetQuizCells[activeTab] || [];
        const blankCells = sheetBlankCells[activeTab] || [];
        const blankForecastCells = sheetBlankForecasts[activeTab] || [];
        console.log("quizCells", quizCells)
        const resetDisplayData = sheetsInitialData[activeTab].map((row, rowIndex) => 
            row.map((cell, colIndex) => {
                const isQuizCell = quizCells.some(q => q.row === rowIndex && q.col === colIndex);
                const isBlankCell = blankCells.some(q => q.row === rowIndex && q.col === colIndex);
                const isBlankForecastCell = blankForecastCells.some(q => q.row === rowIndex && q.col === colIndex);
                return (isQuizCell || isBlankCell || isBlankForecastCell) ? '' : cell;

            })
        );
        
        setSheetsDisplayData(prev => ({
            ...prev,
            [activeTab]: [...resetDisplayData]
        }));
        console.log("Reset to:", resetDisplayData);
    };

const advanceStep = () => {
  setCurrentActiveStepId((prevId) => {
    const nextStep = prevId + 1; // number math
    setNextReady(false);
    if (lessonData[nextStep.toString()]) {
      console.log("Advancing to step:", nextStep);
      return nextStep;
    } else {
      console.log("No more steps.");
      playComplete();
      setModDone(true);
      return prevId; // Stay on current step
    }
  });
};


  useEffect(() => {
  if (currentStepContent) {
    refresh();
    setHintOn(false);
    setHighlightOn(false);
  }
}, [currentStepContent]);

  // Advance step when correct
  useEffect(() => {
    if (isCorrect === true) {
      setNextReady(true);
      playCorrectSoundMCQ();
      triggerConfetti();
    }
  }, [isCorrect]);

    useEffect(() => {
    if (isCorrect === false) {
      playWrongSoundMCQ();
      triggerWiggle();
    }
  }, [isCorrect]);

  // Update step content & reset quiz state when step ID changes
  useEffect(() => {
    setCurrentStepContent(lessonData[currentActiveStepId.toString()]);
    setIsCorrect(null);
    setSelectedOption(""); // Or a default value if you prefer
    console.log("Step updated to:", currentActiveStepId);
  }, [currentActiveStepId]);



  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row' }}>
      <Sidebar onSectionChange={setCurrentActiveStepId}
                currentActiveStepId={currentActiveStepId}
                currentStepContent={currentStepContent}
                setCurrentActiveStepId={setCurrentActiveStepId}
                lessonData = {lessonData}
                highestStep={highestStepIdRef.current}

      />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {currentStepContent ? (
          <Big3
            currentStepContent={currentStepContent}
            highlightOn={highlightOn}
            setHighlightOn={setHighlightOn}
            hintOn={hintOn}
            setHintOn={setHintOn}
            isCorrect={isCorrect}
            setIsCorrect={setIsCorrect}
            handleSubmit={handleSubmit}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            refresh={refresh}
            sheetQuizCells={sheetQuizCells}
            sheetBlankCells={sheetBlankCells}
            handleTabChange={handleTabChange}
            activeTab={activeTab}
            sheetsData={sheetsData}
            setSheetsData={setSheetsData}
            sheetsInitialData={sheetsInitialData}
            setSheetsInitialData={setSheetsInitialData}
            sheetsDisplayData={sheetsDisplayData}
            setSheetsDisplayData={setSheetsDisplayData}
            Qtype={Qtype}
            TargetTab={TargetTab}
            nextReady={nextReady}
            setNextReady={setNextReady}
            advanceStep={advanceStep}
            currentActiveStepId={currentActiveStepId}
            ref={spreadGangRef}
            playSound={playCorrectSoundMCQ}
            highestStep={highestStepIdRef.current}
            totalSteps={totalSteps}
            tempBS={tempBS}
            showCoordinates={showCoordinates}
            hotTableComponent={hotTableComponent }
            tabLocked={tabLocked}
            sheetBlankForecasts={sheetBlankForecasts}
          />
        ) : (
          <p style={{ color: '#1f3a60', textAlign: 'center', marginTop: '3.125rem', }}>
            Loading lesson content...
          </p>
        )}
      </div>
    </div>
  );
}
