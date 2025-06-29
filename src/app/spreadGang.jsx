"use client"
import React, { useState, useEffect, useRef } from 'react';
import Spreadsheet from "./spreadsheet.jsx";
import Spreadbutt from "./spreadbutt.jsx";
import SpreadsheetTabs from "./spreadsheetTabs.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase.js";
import { useSpreadsheetValidator } from './hooks/useSpreadsheetValidator';

export default function SpreadGang({highlightOn, setHighlightOn, hintOn, setHintOn,}) {

    // Define how to split the data across sheets based on row labels
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
            includeRows: ["+ D&A", "- CapEx", "- Change in NWC"] // Cash flow items that affect balance sheet
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

    // Define quiz cells for each sheet (adjust row numbers based on filtered data)
    const sheetQuizCells = {
        intro: [
            { row: 1, col: 1 }, // Revenue
            { row: 2, col: 3 }, // Net Income
        ],
        inputs: [
            { row: 3, col: 2 }, // Gross Profit
            { row: 5, col: 1 }, // SG&A Expense
        ],
        projections: [
            { row: 0, col: 1 }, // + D&A
            { row: 2, col: 2 }, // - Change in NWC
        ],
        valuations: [
            { row: 4, col: 2 }, // Unlevered FCF
            { row: 6, col: 1 }, // Discounted FCF
        ],
        sensitivity: [
            { row: 0, col: 2 }, // Revenue assumption
            { row: 3, col: 3 }, // SG&A assumption
        ]
    };

    const hotTableComponent = useRef(null);
    const { checkCell, validateAllCells, setCorrectAnswers, getScore, setCurrentSheet } = useSpreadsheetValidator(hotTableComponent);

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

    const [dataLoading, setDataLoading] = useState(true);
    
    // Helper function to filter data based on sheet mapping
    const filterDataForSheet = (fullData, sheetKey) => {
        const mapping = sheetMappings[sheetKey];
        if (!mapping || !fullData || fullData.length === 0) return [];
        
        return fullData.filter(row => {
            const label = row[0]; // First column is the label
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
                    
                    // Convert to Handsontable format
                    const hotFormat = orderedData.map(item => [item.label, ...item.values]);
                    const coldFormat = coldOrderedData.map(item => [item.label, ...item.values]);
                    
                    console.log("Full data loaded:", hotFormat);
                    
                    // Split data across sheets
                    const newSheetsData = {};
                    const newSheetsInitialData = {};
                    const newSheetsDisplayData = {};
                    const allCorrectAnswers = {};
                    
                    Object.keys(sheetMappings).forEach(sheetKey => {
                        // Filter data for this sheet
                        const sheetHotData = filterDataForSheet(hotFormat, sheetKey);
                        const sheetColdData = filterDataForSheet(coldFormat, sheetKey);
                        
                        console.log(`${sheetKey} sheet data:`, sheetHotData);
                        
                        // Create display data with quiz cells empty
                        const quizCells = sheetQuizCells[sheetKey] || [];
                        const displayFormat = sheetHotData.map((row, rowIndex) => 
                            row.map((cell, colIndex) => {
                                const isQuizCell = quizCells.some(q => q.row === rowIndex && q.col === colIndex);
                                return isQuizCell ? '' : cell;
                            })
                        );
                        
                        // Extract correct answers for quiz cells
                        quizCells.forEach(({ row, col }) => {
                            if (sheetHotData[row] && sheetHotData[row][col] !== undefined) {
                                allCorrectAnswers[`${sheetKey}_${row},${col}`] = sheetHotData[row][col];
                            }
                        });
                        
                        newSheetsData[sheetKey] = sheetHotData;
                        newSheetsInitialData[sheetKey] = sheetColdData;
                        newSheetsDisplayData[sheetKey] = displayFormat;
                    });
                    
                    setSheetsData(newSheetsData);
                    setSheetsInitialData(newSheetsInitialData);
                    setSheetsDisplayData(newSheetsDisplayData);
                    setCorrectAnswers(allCorrectAnswers);
                    
                    console.log("Split data across sheets:", newSheetsDisplayData);
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

    // Handle tab changes
    const handleTabChange = (newTabId) => {
        setActiveTab(newTabId);
        setCurrentSheet(newTabId); // Update validator's current sheet
        console.log(`Switched to ${newTabId} sheet`);
        console.log(`Data for ${newTabId}:`, sheetsDisplayData[newTabId]);
    };

    const refresh = () => {
        console.log("refresh triggered for", activeTab);
        // Reset current sheet to initial display data (with quiz cells empty)
        const quizCells = sheetQuizCells[activeTab] || [];
        const resetDisplayData = sheetsInitialData[activeTab].map((row, rowIndex) => 
            row.map((cell, colIndex) => {
                const isQuizCell = quizCells.some(q => q.row === rowIndex && q.col === colIndex);
                return isQuizCell ? '' : cell;
            })
        );
        
        setSheetsDisplayData(prev => ({
            ...prev,
            [activeTab]: [...resetDisplayData]
        }));
        console.log("Reset to:", resetDisplayData);
    };

    // Check all quiz answers across all sheets
    const checkAllAnswers = () => {
        const result = validateAllCells();
        if (result) {
            console.log(`Quiz Score: ${result.score}/${result.total} correct (${result.percentage}%)`);
        }
    };

    // Get current score across all sheets
    const getCurrentScore = () => {
        const result = getScore();
        if (result) {
            console.log(`Current progress: ${result.score}/${result.total} (${result.percentage}%)`);
            return result;
        }
        return null;
    };

    // Handle cell changes and check answers
    const handleCellChange = (changes) => {
        if (changes) {
            changes.forEach(([row, col, oldValue, newValue]) => {
                // Check if this is a quiz cell for the current sheet
                const quizCells = sheetQuizCells[activeTab] || [];
                const isQuizCell = quizCells.some(q => q.row === row && q.col === col);
                if (isQuizCell) {
                    checkCell(row, col, activeTab); // Pass sheet identifier
                }
            });
        }
    };

    // Update data for current sheet
    const updateCurrentSheetData = (newData) => {
        setSheetsDisplayData(prev => ({
            ...prev,
            [activeTab]: newData
        }));
    };

    return(
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <SpreadsheetTabs
                initialActiveTab="intro"
                onTabChange={handleTabChange}
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
    )
}