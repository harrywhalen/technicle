"use client"
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, } from 'react';
import Spreadsheet from "./spreadsheet.jsx";
import Spreadbutt from "./spreadbutt.jsx";
import SpreadsheetTabsCopy from "./spreadsheetTabsCopy.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase.js";
import { useSpreadsheetValidator } from '../hooks/useSpreadsheetValidator';
import confetti from 'canvas-confetti';

const SpreadGang = forwardRef(({
  highlightOn, setHighlightOn,
  hintOn, setHintOn,
  currentStepContent, refresh,
  sheetQuizCells, handleTabChange,
  activeTab, sheetsData, setSheetsData,
  sheetsInitialData, setSheetsInitialData,
  sheetsDisplayData, setSheetsDisplayData,
  sheetBlankCells, Qtype, TargetTab, nextReady,
  setNextReady, currentActiveStepId, playSound, showCoordinates,
  tabLocked, sheetBlankForecasts, content, preAnswer,
  setPreAnswer, updateME, SpreadSheet_Selector,
}, ref) => {
const sheetMappings = content?.Bullshit.SheetMappings || {};


  const hotTableComponent = useRef(null);
  const { checkCell, validateAllCells, setCorrectAnswers, getScore, setCurrentSheet, 
    getCorrectCellsROW,  getCorrectCellsCOL, getIncorrectCellsROW, getIncorrectCellsCOL, DEBUG_GOONER,
    clearCORCellsArrays, clearINCCellsArrays,
  } = useSpreadsheetValidator(hotTableComponent);

  const [dataLoading, setDataLoading] = useState(true);

  
  const [correctCellsROW, setCorrectCellsROW] = useState(getCorrectCellsROW())
  const [correctCellsCOL, setCorrectCellsCOL] = useState(getCorrectCellsCOL())
  const [incorrectCellsROW, setIncorrectCellsROW] = useState(getIncorrectCellsROW())
  const [incorrectCellsCOL, setIncorrectCellsCOL] = useState(getIncorrectCellsCOL())

const filterDataForSheet = (fullData, sheetKey) => {
  const mapping = sheetMappings[sheetKey];
  if (!mapping || !fullData || fullData.length === 0) return [];
  
  return fullData.filter(row => {
    const label = row[0];
    return mapping.includeRows.some(includeLabel =>
      label.toString().trim().toLowerCase() === includeLabel.trim().toLowerCase()
    );
  });
};


useEffect(() => {
    clearCORCellsArrays();
    clearINCCellsArrays();
    setIncorrectCellsROW(getIncorrectCellsROW());
    setCorrectCellsROW(getCorrectCellsROW());
    setIncorrectCellsCOL(getIncorrectCellsCOL());
    setCorrectCellsCOL(getCorrectCellsCOL());
}, [updateME]);

  const triggerConfettiC = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6, x: 0.4 },
        colors: ['#1f3a60', '#8be2ff', '#28518d', '#00bfff'],
    });
  };

    const playCorrectSoundC = () => {
    const audio = new Audio("/sounds/correct.mp3");
    audio.volume = 0.3;  // Set volume to 30%
    audio.play().catch(error => {
      console.error("Error playing sound:", error);
    });
  };

      const playWrongSoundC = () => {
  const audio = new Audio("/sounds/wrong.mp3");
  audio.volume = 0.3;  // Set volume to 30%
  audio.play().catch(error => {
    console.error("Error playing sound:", error);
  });
};

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const docRef = doc(db, "models", SpreadSheet_Selector);
        const docSnap = await getDoc(docRef);
        const coldDocRef = doc(db, "models", SpreadSheet_Selector);
        const coldDocSnap = await getDoc(coldDocRef);
        
        if (docSnap.exists()) {
          const orderedData = docSnap.data().orderedData;
          const coldOrderedData = coldDocSnap.exists() ? coldDocSnap.data().orderedData : orderedData;
          
          const hotFormat = orderedData.map(item => {
            if (Array.isArray(item.values)) {
              return [item.label, ...item.values];
            } else if (item.values !== undefined && item.values !== null) {
              return [item.label, item.values];
            } else {
              return [item.label];
            }
          });

          const coldFormat = coldOrderedData.map(item => {
            if (Array.isArray(item.values)) {
              return [item.label, ...item.values];
            } else if (item.values !== undefined && item.values !== null) {
              return [item.label, item.values];
            } else {
              return [item.label];
            }
          });
          
          const newSheetsData = {};
          const newSheetsInitialData = {};
          const newSheetsDisplayData = {};
          
          Object.keys(sheetMappings).forEach(sheetKey => {
            const sheetHotData = filterDataForSheet(hotFormat, sheetKey);
            const sheetColdData = filterDataForSheet(coldFormat, sheetKey);
            
            const quizCells = sheetQuizCells[sheetKey] || [];
            const blankCells = sheetBlankCells[sheetKey] || [];
            const blankForecastCells = sheetBlankForecasts[sheetKey] || [];
            const displayFormat = sheetHotData.map((row, rowIndex) => 
              row.map((cell, colIndex) => {
                const isQuizCell = quizCells.some(q => q.row === rowIndex && q.col === colIndex);
                const isBlankCell = blankCells.some(q => q.row === rowIndex && q.col === colIndex);
                const isBlankForecastCell = blankForecastCells.some(q => q.row === rowIndex && q.col === colIndex);
                return (isQuizCell || isBlankCell || isBlankForecastCell) ? '' : cell;

              })
            );

            newSheetsData[sheetKey] = sheetHotData;
            newSheetsInitialData[sheetKey] = sheetColdData;
            newSheetsDisplayData[sheetKey] = displayFormat;
          });
          
          setSheetsData(newSheetsData);
          setSheetsInitialData(newSheetsInitialData);
          setSheetsDisplayData(newSheetsDisplayData);
        } else {
          console.log("No document found!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setDataLoading(false);
    };

    fetchData();
  }, []);

  // ✅ NEW: Dynamically update correct answers when sheetQuizCells or sheetsData changes
  useEffect(() => {
    if (!sheetsData || !sheetQuizCells) return;

    const allCorrectAnswers = {};

    Object.keys(sheetQuizCells).forEach(sheetKey => {
      const quizCells = sheetQuizCells[sheetKey] || [];
      const sheetHotData = sheetsData[sheetKey] || [];

      quizCells.forEach(({ row, col }) => {
        if (sheetHotData[row] && sheetHotData[row][col] !== undefined) {
          allCorrectAnswers[`${sheetKey}_${row},${col}`] = sheetHotData[row][col];
        }
      });
    });

    setCorrectAnswers(allCorrectAnswers);
  }, [sheetQuizCells, sheetsData, setCorrectAnswers]);

const checkAllAnswers = () => {
    clearCORCellsArrays();
    clearINCCellsArrays();
    setPreAnswer(false)
    setIncorrectCellsROW(getIncorrectCellsROW());
    setCorrectCellsROW(getCorrectCellsROW());
    setIncorrectCellsCOL(getIncorrectCellsCOL());
    setCorrectCellsCOL(getCorrectCellsCOL());
    //console.log('correctCellsCOL', correctCellsCOL)
    //console.log('correctCellsROW', correctCellsROW)
    //console.log('getCorrectCellsROW()', getCorrectCellsROW())
    //console.log('getCorrectCellsCOL()', getCorrectCellsCOL())
  const result = validateAllCells(activeTab);
  if (result) {
    console.log(`Quiz Score: ${result.score}/${result.total} correct (${result.percentage}%)`);
    const isPerfectScore = result.percentage === 100;
    setTimeout(() => setNextReady(isPerfectScore), 0);
    if (isPerfectScore) {
      playCorrectSoundC();
      triggerConfettiC();
    }
    else 
    playWrongSoundC();

  }
};

  const getCurrentScore = () => {
    const result = getScore();
    if (result) {
      console.log(`Current progress: ${result.score}/${result.total} (${result.percentage}%)`);
      return result;
    }
    return null;
  };

  const handleCellChange = (changes) => {
    if (changes) {
      changes.forEach(([row, col, oldValue, newValue]) => {
        const quizCells = sheetQuizCells[activeTab] || [];
        const isQuizCell = quizCells.some(q => q.row === row && q.col === col);
        if (isQuizCell) {
          checkCell(row, col, activeTab);
        }
      });
    }
  };

  const updateCurrentSheetData = (newData) => {
    setSheetsDisplayData(prev => ({
      ...prev,
      [activeTab]: newData
    }));
  };

    useImperativeHandle(ref, () => ({
    checkAllAnswers,
    getCurrentScore,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <SpreadsheetTabsCopy
        initialActiveTab="inputs"
        onTabChange={handleTabChange}
        TargetTab={TargetTab}
        nextReady={nextReady}
        setNextReady={setNextReady}
        currentActiveStepId={currentActiveStepId}
        tabLocked={tabLocked}
      />
      <Spreadsheet
        data={sheetsDisplayData[activeTab] || []}
        setData={updateCurrentSheetData}
        highlightOn={highlightOn}
        setHighlightOn={setHighlightOn}
        dataLoading={dataLoading}
        hotTableComponent={hotTableComponent}
        refresh={refresh}
        onCellChange={handleCellChange}
        currentStepContent={currentStepContent}
        activeTab={activeTab}
        preAnswer={preAnswer}
        correctCellsROW={correctCellsROW}
        correctCellsCOL={correctCellsCOL}
        incorrectCellsROW = {incorrectCellsROW || []}
        incorrectCellsCOL = {incorrectCellsCOL}
        clearINCCellsArrays = {clearINCCellsArrays}
        clearCORCellsArrays = {clearCORCellsArrays}
      />
      <Spreadbutt
        refresh={refresh}
        data={sheetsDisplayData[activeTab] || []}
        setData={updateCurrentSheetData}
        highlightOn={highlightOn}
        setHighlightOn={setHighlightOn}
        hintOn={hintOn}
        setHintOn={setHintOn}
        checkAllAnswers={checkAllAnswers}
        getCurrentScore={getCurrentScore}
        showCoordinates={showCoordinates}
      />
    </div>
  );
});

export default SpreadGang;
