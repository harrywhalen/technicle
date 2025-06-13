"use client";
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import Image from "next/image"; // Keep if used elsewhere, removed if not
import TextBox from "./textbox.jsx";
import Sidebar from "./sidebar.jsx"; // Ensure correct capitalization

import LessonName from "./lessonName.jsx";
import Big3 from "./big3.jsx";

// --- Your "Toy Box" (Lesson Content Data) ---
// This is your mock database for content.
// In a real app, this would be fetched from Firestore or another backend.
const lessonContentData = {
    'dcf-intro': { // Corresponds to Sidebar's "What is a DCF?"
        type: 'intro', // Indicate the type of content for Big3
        textBoxContent: "This is a DCF, or discounted cash flow analysis—a valuation method used to estimate the intrinsic value of an asset based on its expected future cash flows. By projecting those cash flows and discounting them back to present value using a rate that reflects the risk of the investment, a DCF helps determine whether an asset is undervalued or overvalued relative to its current price.",
        quiz: {
            question: "What does DCF stand for?",
            options: ["Direct Cash Flow", "Discounted Cash Flow", "Dynamic Capital Flow", "Debt Conversion Formula"],
            correctAnswer: "Discounted Cash Flow"
        }
    },
    'key-metrics': {
        type: 'spreadsheet', // Indicate this step primarily shows the spreadsheet
        textBoxContent: "Key metrics like Net Sales, COGS, OPEX, and EBITDA are the building blocks of financial projections. Understanding how they relate to each other is crucial.",
        quiz: {
            question: "Which of these is NOT a key metric for a DCF?",
            options: ["Net Sales", "EBITDA", "Social Media Followers", "Gross Profit"],
            correctAnswer: "Social Media Followers"
        },
        // You could add specific spreadsheet config for 'Key Metrics' here if needed
        spreadsheetConfig: {
            initialTab: 'inputs' // Default tab to show when 'Key Metrics' is active
        }
    },
    'forecasting': {
        type: 'spreadsheet',
        textBoxContent: "Forecasting involves projecting future financial performance. This often relies on historical trends and reasonable assumptions about growth rates and margins.",
        quiz: {
            question: "What is a common method for forecasting revenue?",
            options: ["Guessing", "Historical Growth Rates", "Random Number Generation", "Looking at the moon"],
            correctAnswer: "Historical Growth Rates"
        },
        spreadsheetConfig: {
            initialTab: 'projections'
        }
    },
    'terminal-value': {
        type: 'spreadsheet',
        textBoxContent: "Terminal Value captures the value of the company beyond the explicit projection period. It's typically calculated using either the Gordon Growth Model or the Exit Multiple Method.",
        quiz: {
            question: "Which model is often used for Terminal Value?",
            options: ["Black-Scholes", "CAPM", "Gordon Growth Model", "FIFO"],
            correctAnswer: "Gordon Growth Model"
        },
        spreadsheetConfig: {
            initialTab: 'valuations' // Assuming Terminal Value is part of valuations tab
        }
    },
    'final-valuation': {
        type: 'spreadsheet',
        textBoxContent: "The final valuation sums the present value of projected free cash flows and the present value of the terminal value to arrive at the company's intrinsic value.",
        quiz: {
            question: "What does the sum of PV of UFCF and PV of Terminal Value give you?",
            options: ["Net Income", "Enterprise Value", "Market Cap", "Book Value"],
            correctAnswer: "Enterprise Value"
        },
        spreadsheetConfig: {
            initialTab: 'valuations' // Default tab to show when 'Final Valuation' is active
        }
    },
    // Adding content for your 30 "Step X" items
    ...Array.from({ length: 30 }, (_, i) => {
        const stepNum = i + 1;
        return {
            [`step-${stepNum}`]: {
                type: (stepNum <= 5 ? 'intro' : 'spreadsheet'), // Example: first 5 steps are intro, rest are spreadsheet
                textBoxContent: `This is the content for Step ${stepNum}. Explore more details about this part of the DCF.`,
                quiz: {
                    question: `Quiz for Step ${stepNum}: What is ${stepNum} + ${stepNum}?`,
                    options: [`${stepNum * 2}`, `${stepNum * 2 + 1}`, `${stepNum * 2 - 1}`],
                    correctAnswer: `${stepNum * 2}`
                },
                spreadsheetConfig: { // Example: Different tab for higher steps
                    initialTab: stepNum % 2 === 0 ? 'inputs' : 'projections'
                }
            }
        };
    }).reduce((acc, curr) => ({ ...acc, ...curr }), {}) // Flatten the array of objects into a single object
};

// ---------------------------------------------

export default function Module() {
    // State to hold the ID of the currently active step from the Sidebar
    const [currentActiveStepId, setCurrentActiveStepId] = useState('dcf-intro'); // Initialize with your first lesson/step

    // State to hold the actual content object for the current active step
    const [currentStepContent, setCurrentStepContent] = useState(
        lessonContentData[currentActiveStepId] // Initialize with content for the default active step
    );

    // useEffect to update currentStepContent whenever currentActiveStepId changes
    useEffect(() => {
        const newContent = lessonContentData[currentActiveStepId];
        if (newContent) {
            setCurrentStepContent(newContent);
        } else {
            console.warn(`Content not found for step ID: ${currentActiveStepId}`);
            setCurrentStepContent(null); // Set to null or a default error state
        }
    }, [currentActiveStepId]); // Dependency array: re-run this effect when currentActiveStepId changes

    return (
        <div
            style={{
                // Removed minWidth: '100vh' and marginLeft: '190px'
                // as the main layout (Navbar, Sidebar) will handle positioning
                // and responsive sizing is typically handled by '100vw' on body/html
                // or via parent containers (like _app.js's main tag).
                minHeight: '100vh',
                display: 'flex', // This div will now lay out its children (Sidebar + content column)
                flexDirection: 'row', // Horizontally
                
            }}
        >
            {/* Sidebar - Pass the state setter function */}
            <Sidebar onSectionChange={setCurrentActiveStepId} />

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1, // Allows this column to take up remaining horizontal space
                    // Pushing this content area to the right of the Sidebar (250px)
                    // and down from the Navbar (70px) is handled by _app.js's <main> tag.
                    // This div just organizes LessonName and Big3 vertically.
                }}
            >
                <LessonName /> {/* This should represent the current lesson title */}
                {currentStepContent ? (
                    // Pass the content to Big3
                    <Big3 currentStepContent={currentStepContent} />
                ) : (
                    <p style={{ color: '#1f3a60', textAlign: 'center', marginTop: '50px',  }}>
                        Loading lesson content...
                    </p>
                )}
            </div>

            {/* Navbar is typically rendered directly in _app.js for full-page coverage,
                but if it's placed here, ensure it's still fixed and on top.
                I'll keep it here as you placed it, but note the common _app.js pattern. */}
            
        </div>
    );
}