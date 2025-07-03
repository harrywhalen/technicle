"use client";
import React, { useState, useEffect, useRef, useMemo  } from 'react';
import Sidebar from "./sidebar.jsx";
import LessonName from "./lessonName.jsx";
import Big3 from "./big3.jsx";
import lessonData from "./data/lessondata.json"; // Import the JSON file
import { useSpreadsheetValidator } from './hooks/useSpreadsheetValidator';

export default function Module() {
  const [highlightOn, setHighlightOn] = useState(false);
  const [hintOn, setHintOn] = useState(false);

  const [currentActiveStepId, setCurrentActiveStepId] = useState('1');
  const [currentStepContent, setCurrentStepContent] = useState(lessonData['1']);

  const [isCorrect, setIsCorrect] = useState(null); // null = no answer yet, true/false = result
  const [selectedOption, setSelectedOption] = useState("Discounted Cash Flow");

  const correctAnswer = currentStepContent?.quiz.correctAnswer;

  const hotTableComponent = useRef(null);
const { setCurrentSheet } = useSpreadsheetValidator(hotTableComponent);

  

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = selectedOption === correctAnswer;
    setIsCorrect(result);
    console.log("Selected option:", selectedOption);
    console.log("Correct answer:", correctAnswer);
    console.log("Is correct?", result);
  };

let Quizcel_1_tab = currentStepContent?.Quizcel_1.tab;
let Quizcel_1_Row = currentStepContent?.Quizcel_1.row;
let Quizcel_1_column = currentStepContent?.Quizcel_1.column;

let Quizcel_2_tab = currentStepContent?.Quizcel_2.tab;
let Quizcel_2_Row = currentStepContent?.Quizcel_2.row;
let Quizcel_2_column = currentStepContent?.Quizcel_2.column;

const sheetQuizCells = useMemo(() => {
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

  if (currentStepContent.Quizcel_1) {
    const { tab, row, column } = currentStepContent.Quizcel_1;
    result[tab]?.push({ row, col: column });
  }
  if (currentStepContent.Quizcel_2) {
    const { tab, row, column } = currentStepContent.Quizcel_2;
    result[tab]?.push({ row, col: column });
  }

  return result;
}, [currentStepContent]);

const sheetBlankCells = useMemo(() => {
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
    if (currentStepContent.Blankcel_1) {
    const { tab, row, column } = currentStepContent.Blankcel_1;
    result[tab]?.push({ row, col: column });
  }

  return result;
}, [currentStepContent]);


      

          // Current active tab state
    const [activeTab, setActiveTab] = useState('intro');

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
        setActiveTab(newTabId);
        setCurrentSheet(newTabId); // Update validator's current sheet
        console.log(`Switched to ${newTabId} sheet`);
        console.log(`Data for ${newTabId}:`, sheetsDisplayData[newTabId]);
    };

      const refresh = () => {
        // Reset current sheet to initial display data (with quiz cells empty)
        const quizCells = sheetQuizCells[activeTab] || [];
        const blankCells = sheetBlankCells[activeTab] || [];
        console.log("quizCells", quizCells)
        const resetDisplayData = sheetsInitialData[activeTab].map((row, rowIndex) => 
            row.map((cell, colIndex) => {
                const isQuizCell = quizCells.some(q => q.row === rowIndex && q.col === colIndex);
                const isBlankCell = blankCells.some(q => q.row === rowIndex && q.col === colIndex);
                return isQuizCell || isBlankCell ? '' : cell;
            })
        );
        
        setSheetsDisplayData(prev => ({
            ...prev,
            [activeTab]: [...resetDisplayData]
        }));
        console.log("Reset to:", resetDisplayData);
    };

  const advanceStepIfCorrect = () => {
    setCurrentActiveStepId((prevId) => {
      const nextStep = (parseInt(prevId) + 1).toString();
      if (lessonData[nextStep]) {
        console.log("Advancing to step:", nextStep);
        return nextStep;
      } else {
        console.log("No more steps.");
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
      advanceStepIfCorrect();
    }
  }, [isCorrect]);

  // Update step content & reset quiz state when step ID changes
  useEffect(() => {
    setCurrentStepContent(lessonData[currentActiveStepId]);
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

      />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <LessonName />
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
          />
        ) : (
          <p style={{ color: '#1f3a60', textAlign: 'center', marginTop: '50px' }}>
            Loading lesson content...
          </p>
        )}
      </div>
    </div>
  );
}
