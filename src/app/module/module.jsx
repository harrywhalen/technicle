"use client";
import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import Sidebar from "./sidebar.jsx";
import LessonName from "./lessonName.jsx";
import Big3 from "./big3.jsx";
import lessonData from "../data/lessondata.json";
import WC from "../data/WC.json";
import contentCFS from "../data/lessondataCFS.json";
import utopian from "../data/utopian.json";
import contentBERK from "../data/lessondataBERK.json";
import { useSpreadsheetValidator } from '../hooks/useSpreadsheetValidator';
import { useProgressTracker } from '../hooks/useProgressTracker'; // NEW IMPORT
import confetti from 'canvas-confetti';

const moduleDatabase = {
  1: {
    title: 'The Income Statement',
    content: lessonData,
  },
  2: {
    title: 'State Management',
    content: WC,
  },
  3: {
    title: 'Berk Hath',
    content: contentCFS,
  },
  4: {
    title: 'Routing',
    content: utopian,
  },
  5: {
    title: 'Testing',
    content: contentBERK,
  },
  6: {
    title: 'Performance',
    content: contentBERK,
  },
  // Add the rest of your modules here...
};

function ModuleContent({setModDone, hotRef}) {
  const classes = [];
  const searchParams = useSearchParams();
  const moduleId = parseInt(searchParams.get("moduleId"));

  // Initialize progress tracker
  const { 
    userProgress, 
    updateLocalProgress, 
    saveProgressImmediately,
    markModuleComplete, 
    isLoading: progressLoading,
    hasPendingChanges 
  } = useProgressTracker(moduleId);

  // If moduleId is missing or invalid, render fallback
  if (!moduleId || !moduleDatabase[moduleId]) {
    return <div>Module not found.</div>;
  }

  const modContent = moduleDatabase[moduleId]?.content;
  const SpreadSheet_Selector = modContent.Bullshit.Spreadsheet_Selector;

  const [nextReady, setNextReady] = useState(false);
  const spreadGangRef = useRef(null);
  const [highlightOn, setHighlightOn] = useState(false);
  const [hintOn, setHintOn] = useState(false);
  
  // Initialize with progress from Firebase (will be updated when data loads)
  const [currentActiveStepId, setCurrentActiveStepId] = useState(1);
  const [currentStepContent, setCurrentStepContent] = useState(modContent['1']);
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedOption, setSelectedOption] = useState("Discounted Cash Flow");

  const correctAnswer = currentStepContent?.quiz.correctAnswer;
  const hotTableComponent = useRef(null);
  const { setCurrentSheet, getIncorrectCellsROW, getIncorrectCellsCOL, getCorrectCellsCOL, getCorrectCellsROW, DEBUG_GOONER, clearCORCellsArrays, clearINCCellsArrays, } = useSpreadsheetValidator(hotTableComponent);

  // Use ref to track highest step (will be synced with Firebase data)
  const highestStepIdRef = useRef(1);
  const totalSteps = useMemo(() => Object.keys(modContent).length, [modContent]);
  const [tabLocked, setTabLocked] = useState(true);
  const [preAnswer, setPreAnswer] = useState(true);
  const [updateME, setUpdateME] = useState(0);

  // UPDATED: Initialize with saved progress when Firebase data loads
  useEffect(() => {
    if (!progressLoading && userProgress) {
      console.log("Loading saved progress:", userProgress);
      setCurrentActiveStepId(userProgress.currentStep);
      highestStepIdRef.current = userProgress.highestStep;
    }
  }, [progressLoading, userProgress]);

  // UPDATED: Update local progress when step changes (no Firebase write until exit)
  useEffect(() => {
    if (!progressLoading && currentActiveStepId > 0) {
      updateLocalProgress(currentActiveStepId, highestStepIdRef.current);
    }
  }, [currentActiveStepId, progressLoading, updateLocalProgress]);

  // Update highest step tracker
  useEffect(() => {
    if (currentActiveStepId >= highestStepIdRef.current) {
      console.log("Updating highest step to:", currentActiveStepId);
      highestStepIdRef.current = currentActiveStepId;
      // Update local progress with new highest step
      if (!progressLoading) {
        updateLocalProgress(currentActiveStepId, currentActiveStepId);
      }
    } else {
      console.log("Already higher step reached, current:", currentActiveStepId, "highest:", highestStepIdRef.current);
    }
  }, [currentActiveStepId, progressLoading, updateLocalProgress]);

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

  const [wiggleTime, setWiggleTime] = useState(false);

  const triggerWiggle = () => {
    setWiggleTime(true);
    setIsCorrect(null);
    setTimeout(() => setWiggleTime(false), 1100);
  };

  const playCorrectSoundMCQ = () => {
    const audio = new Audio("/sounds/correct.mp3");
    audio.volume = 0.3;
    audio.play().catch(error => {
      console.error("Error playing sound:", error);
    });
  };

  const playWrongSoundMCQ = () => {
    const audio = new Audio("/sounds/wrong.mp3");
    setIsCorrect(null);
    audio.volume = 0.3;
    audio.play().catch(error => {
      console.error("Error playing sound:", error);
    });
  };

  const playComplete = () => {
    setTimeout(() => {
      const audio = new Audio("/sounds/complete.mp3");
      audio.volume = 0.3;
      audio.play().catch(error => {
        console.error("Error playing complete sound:", error);
      });
    }, 500);
  };

  const handleCheckAnswers = () => {
    if (spreadGangRef.current) {
      spreadGangRef.current.checkAllAnswers();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsCorrect(null);
    if (Qtype === "MCQ") {
      const result = selectedOption === correctAnswer;
      setIsCorrect(result);
      setTimeout(() => setIsCorrect(result), 10);
    } else {
      handleCheckAnswers();
    }
  };

  let Qtype = currentStepContent?.Qtype;
  let TargetTab = currentStepContent?.targetTab;

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

    for (let i = 0; i <= 160; i++) {
      const quizCel = currentStepContent[`Quizcels_ROW_${i}`];
      if (quizCel) {
      for (const [val, col] of Object.entries(quizCel.cols)) {
      console.log("Val", val, "Col", col)
        const { tab, cols } = quizCel;
        result[tab]?.push({ row: i, col });
      }

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

    for (let i = 0; i <= 160; i++) {
      const blankCel = currentStepContent[`Blankcels_COL_${i}`];
      if (blankCel) {
      for (const [val, row] of Object.entries(blankCel.rows)) {
        const { tab, rows } = blankCel;
        result[tab]?.push({ col: i, row });
      }

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


for (let i = 0; i <= 16; i++) {
  const BlankFOR = currentStepContent[`BlankFORs_COL_${i}`];
  if (BlankFOR && i < 10) {
    const { tab, rows } = BlankFOR;
    result[tab] ??= [];

    for (const [_, row] of Object.entries(rows)) {
      for (let c = i; c <= 9; c++) {
        result[tab].push({ col: c, row });
      }
    }
  }
}


    return result;
  }, [currentStepContent]);

  useEffect(() => {
    console.log("sheetBlankForecasts:", sheetBlankForecasts);
  }, [sheetBlankForecasts]);

  const [activeTab, setActiveTab] = useState('inputs');
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

  const handleTabChange = (newTabId) => {
    if (tabLocked === false) {
      setActiveTab(newTabId);
      setCurrentSheet(newTabId);
      console.log(`Switched to ${newTabId} sheet`);
      console.log(`Data for ${newTabId}:`, sheetsDisplayData[newTabId]);
    }
  };

  const refresh = () => {
    //console.log("bithc", sheetBlankForecasts.inputs);
    const quizCells = sheetQuizCells[activeTab] || [];
    const blankCells = sheetBlankCells[activeTab] || [];
    const blankForecastCells = sheetBlankForecasts[activeTab] || [];
    console.log("quizCells", quizCells);
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

  // UPDATED: Modified advanceStep with immediate save for module completion
  const advanceStep = () => {
    clearCORCellsArrays();
    clearINCCellsArrays();
    setPreAnswer(true);
    setUpdateME((prev => prev + 1));
    
    setCurrentActiveStepId((prevId) => {
      const nextStep = prevId + 1;
      setNextReady(false);
      
      if (modContent[nextStep.toString()]) {
        if (nextStep > highestStepIdRef.current) {
          highestStepIdRef.current = nextStep;
        }
        return nextStep;
      } else {
        // Module completed - save immediately to Firebase
        playComplete();
        console.log("Module completed, saving progress immediately");
        saveProgressImmediately(prevId, highestStepIdRef.current).then(() => {
          markModuleComplete();
          console.log("Module marked as complete");
        });
        setModDone(true);
        return prevId;
      }
    });
  };

  // Optional: Manual save function for peace of mind
  const handleManualSave = () => {
    console.log("Manual save triggered");
    saveProgressImmediately(currentActiveStepId, highestStepIdRef.current);
  };

  useEffect(() => {
    if (currentStepContent) {
      refresh();
      setHintOn(false);
      setHighlightOn(false);
    }
  }, [currentStepContent]);

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

  useEffect(() => {
    setCurrentStepContent(modContent[currentActiveStepId.toString()]);
    setIsCorrect(null);
    setSelectedOption("");
    console.log("Step updated to:", currentActiveStepId);
  }, [currentActiveStepId, modContent]);

  // Show loading while Firebase data is loading
  if (progressLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#1f3a60'
      }}>
        <p>Loading your progress...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row' }}>
      <Sidebar 
        onSectionChange={setCurrentActiveStepId}
        currentActiveStepId={currentActiveStepId}
        currentStepContent={currentStepContent}
        setCurrentActiveStepId={setCurrentActiveStepId}
        modContent={modContent}
        highestStep={highestStepIdRef.current}
      />

        
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
            wiggleTime={wiggleTime}
            showCoordinates={showCoordinates}
            hotTableComponent={hotTableComponent}
            tabLocked={tabLocked}
            sheetBlankForecasts={sheetBlankForecasts}
            content={modContent}
            preAnswer={preAnswer}
            getIncorrectCellsROW={getIncorrectCellsROW}
            setPreAnswer={setPreAnswer}
            updateME={updateME}
            SpreadSheet_Selector={SpreadSheet_Selector}
          />
        ) : (
          <p style={{ color: '#1f3a60', textAlign: 'center', marginTop: '3.125rem' }}>
            Loading lesson content...
          </p>
        )}
      </div>
  );
}

function ModuleLoading() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#1f3a60'
    }}>
      <p>Loading module...</p>
    </div>
  );
}

export default function Module({setModDone}) {
  return (
    <Suspense fallback={<ModuleLoading />}>
      <ModuleContent setModDone={setModDone} />
    </Suspense>
  );
}