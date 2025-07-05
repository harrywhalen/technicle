"use client"
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, } from 'react';
import Spreadsheet from "./spreadsheet.jsx";
import Spreadbutt from "./spreadbutt.jsx";
import SpreadsheetTabs from "./spreadsheetTabs.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase.js";
import { useSpreadsheetValidator } from './hooks/useSpreadsheetValidator';
import lessonData from "./data/lessondata.json"; // Import the JSON file

const SpreadGang = forwardRef(({
  highlightOn, setHighlightOn,
  hintOn, setHintOn,
  currentStepContent, refresh,
  sheetQuizCells, handleTabChange,
  activeTab, sheetsData, setSheetsData,
  sheetsInitialData, setSheetsInitialData,
  sheetsDisplayData, setSheetsDisplayData,
  sheetBlankCells, Qtype, TargetTab, nextReady,
  setNextReady, currentActiveStepId,
}, ref) => {
  const sheetMappings = {
    intro: {
      name: "Summary",
      includeRows: ["Revenue", "Net Income", "Unlevered FCF", "Terminal Value", "Discounted TV"]
    },
    inputs: {
      name: "Income Statement", 
      includeRows: ["Revenue", "COGS", "Gross Profit", "R&D Expense", "SG&A Expense", 
                   "EBITDA", "Depreciation & Amort.", "EBIT", "Interest Expense", 
                   "EBT", "Tax @ 25.2%", "Net Income"]
    },
    projections: {
      name: "Balance Sheet",
      includeRows: ["+ D&A", "- CapEx", "- Change in NWC"]
    },
    valuations: {
      name: "Cash Flow Statement",
      includeRows: ["Net Income", "+ D&A", "- CapEx", "- Change in NWC", "Unlevered FCF", 
                   "Discount Factor (10%)", "Discounted FCF", "Terminal Value", "Discounted TV"]
    },
    sensitivity: {
      name: "Assumptions",
      includeRows: ["Revenue", "COGS", "R&D Expense", "SG&A Expense", "Depreciation & Amort.", 
                   "Interest Expense", "Tax @ 25.2%", "Discount Factor (10%)"]
    }
  };

  const hotTableComponent = useRef(null);
  const { checkCell, validateAllCells, setCorrectAnswers, getScore, setCurrentSheet } = useSpreadsheetValidator(hotTableComponent);

  const [dataLoading, setDataLoading] = useState(true);

  const filterDataForSheet = (fullData, sheetKey) => {
    const mapping = sheetMappings[sheetKey];
    if (!mapping || !fullData || fullData.length === 0) return [];
    
    return fullData.filter(row => {
      const label = row[0];
      return mapping.includeRows.some(includeLabel => 
        label && label.toString().includes(includeLabel)
      );
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "models", "defaultModel");
        const docSnap = await getDoc(docRef);
        const coldDocRef = doc(db, "models", "defaultModel");
        const coldDocSnap = await getDoc(coldDocRef);
        
        if (docSnap.exists()) {
          const orderedData = docSnap.data().orderedData;
          const coldOrderedData = coldDocSnap.exists() ? coldDocSnap.data().orderedData : orderedData;
          
          const hotFormat = orderedData.map(item => [item.label, ...item.values]);
          const coldFormat = coldOrderedData.map(item => [item.label, ...item.values]);
          
          const newSheetsData = {};
          const newSheetsInitialData = {};
          const newSheetsDisplayData = {};
          
          Object.keys(sheetMappings).forEach(sheetKey => {
            const sheetHotData = filterDataForSheet(hotFormat, sheetKey);
            const sheetColdData = filterDataForSheet(coldFormat, sheetKey);
            
            const quizCells = sheetQuizCells[sheetKey] || [];
            const blankCells = sheetBlankCells[sheetKey] || [];

            const displayFormat = sheetHotData.map((row, rowIndex) => 
              row.map((cell, colIndex) => {
                const isQuizCell = quizCells.some(q => q.row === rowIndex && q.col === colIndex);
                const isBlankCell = blankCells.some(q => q.row === rowIndex && q.col === colIndex);
                return isQuizCell || isBlankCell ? '' : cell;
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
    const result = validateAllCells(activeTab);
    if (result) {
      console.log(`Quiz Score: ${result.score}/${result.total} correct (${result.percentage}%)`);
      setTimeout(() => setNextReady(result.percentage === 100), 0);
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
      <SpreadsheetTabs
        initialActiveTab="intro"
        onTabChange={handleTabChange}
        TargetTab={TargetTab}
        nextReady={nextReady}
        setNextReady={setNextReady}
        currentActiveStepId={currentActiveStepId}
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
      />
    </div>
  );
});

export default SpreadGang;
