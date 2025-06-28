"use client"
import React, { useState, useEffect, useRef } from 'react';
import Spreadsheet from "./spreadsheet.jsx";
import Spreadbutt from "./spreadbutt.jsx";
import SpreadsheetTabs from "./spreadsheetTabs.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase.js";
import { useSpreadsheetValidator } from './hooks/useSpreadsheetValidator'; // Import the validator

export default function SpreadGang({highlightOn, setHighlightOn, hintOn, setHintOn,}) {

    // Define which cells are quiz questions (these will be hidden and validated)
    const quizCells = [
        { row: 1, col: 1 },
        { row: 2, col: 3 },
        { row: 5, col: 2 },
    ];

    const hotTableComponent = useRef(null);
    const { checkCell, validateAllCells, setCorrectAnswers, getScore } = useSpreadsheetValidator(hotTableComponent);

    const [data, setData] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [displayData, setDisplayData] = useState([]); // New: data shown to user
    const [dataLoading, setDataLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "models", "defaultModel");
                const docSnap = await getDoc(docRef);

                const ColddocRef = doc(db, "models", "defaultModel");
                const ColddocSnap = await getDoc(ColddocRef);
                
                if (docSnap.exists()) {
                    const orderedData = docSnap.data().orderedData;
                    const coldorderedData = ColddocSnap.data().orderedData;
                    
                    // Convert from Firebase format to Handsontable format
                    const hotFormat = orderedData.map(item => [item.label, ...item.values]);
                    const coldFormat = coldorderedData.map(item => [item.label, ...item.values]);
                    
                    // Create display data with quiz cells empty
                    const displayFormat = hotFormat.map((row, rowIndex) => 
                        row.map((cell, colIndex) => {
                            const isQuizCell = quizCells.some(q => q.row === rowIndex && q.col === colIndex);
                            return isQuizCell ? '' : cell;
                        })
                    );
                    
                    // Extract correct answers for quiz cells only
                    const correctAnswers = {};
                    quizCells.forEach(({ row, col }) => {
                        if (hotFormat[row] && hotFormat[row][col] !== undefined) {
                            correctAnswers[`${row},${col}`] = hotFormat[row][col];
                        }
                    });
                    
                    // Set all the data
                    setData(hotFormat); // Full data (for reference)
                    setInitialData(coldFormat); // Initial state
                    setDisplayData(displayFormat); // What user sees
                    setCorrectAnswers(correctAnswers); // Encoded answers for validation
                    
                } else {
                    console.log("No document found lil fella!");
                    setData([]);
                    setInitialData([]);
                    setDisplayData([]);
                }
                
                setDataLoading(false);
                
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]);
                setInitialData([]);
                setDisplayData([]);
                setDataLoading(false);
            }
        };

        fetchData();
    }, []);

    const refresh = () => {
        console.log("refresh triggered");
        // Reset to initial display data (with quiz cells empty)
        const resetDisplayData = initialData.map((row, rowIndex) => 
            row.map((cell, colIndex) => {
                const isQuizCell = quizCells.some(q => q.row === rowIndex && q.col === colIndex);
                return isQuizCell ? '' : cell;
            })
        );
        setDisplayData([...resetDisplayData]);
        console.log("Reset to:", resetDisplayData);
    };

    // New function to check all quiz answers
    const checkAllAnswers = () => {
        const result = validateAllCells();
        if (result) {
            console.log(`Quiz Score: ${result.score}/${result.total} correct (${result.percentage}%)`);
        }
    };

    // New function to get current score without showing results
    const getCurrentScore = () => {
        const result = getScore();
        if (result) {
            console.log(`Current progress: ${result.score}/${result.total} (${result.percentage}%)`);
            return result;
        }
        return null;
    };

    // Function to handle cell changes and check answers
    const handleCellChange = (changes) => {
        if (changes) {
            changes.forEach(([row, col, oldValue, newValue]) => {
                // Check if this is a quiz cell
                const isQuizCell = quizCells.some(q => q.row === row && q.col === col);
                if (isQuizCell) {
                    checkCell(row, col);
                }
            });
        }
    };

    return(
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <SpreadsheetTabs/>
            <Spreadsheet
                data={displayData} // Use displayData instead of data
                setData={setDisplayData} // Update displayData
                highlightOn={highlightOn}
                setHighlightOn={setHighlightOn}
                dataLoading={dataLoading}
                hotTableComponent={hotTableComponent}
                refresh={refresh}
                onCellChange={handleCellChange} // New prop for handling changes
            />
            <Spreadbutt
                refresh={refresh}
                data={displayData} // Use displayData
                setData={setDisplayData} // Update displayData
                highlightOn={highlightOn}
                setHighlightOn={setHighlightOn}
                hintOn={hintOn}
                setHintOn={setHintOn}
                checkAllAnswers={checkAllAnswers} // New prop
                getCurrentScore={getCurrentScore} // New prop
            />
        </div>
    )
}