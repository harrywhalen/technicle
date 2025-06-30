"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from "./sidebar.jsx";
import LessonName from "./lessonName.jsx";
import Big3 from "./big3.jsx";
import lessonData from "./data/lessondata.json"; // Import the JSON file

export default function Module() {
  const [highlightOn, setHighlightOn] = useState(false);
  const [hintOn, setHintOn] = useState(false);

  const [currentActiveStepId, setCurrentActiveStepId] = useState('1');
  const [currentStepContent, setCurrentStepContent] = useState(lessonData['1']);

  const [isCorrect, setIsCorrect] = useState(null); // null = no answer yet, true/false = result
  const [selectedOption, setSelectedOption] = useState("Discounted Cash Flow");

  const correctAnswer = currentStepContent?.quiz.correctAnswer;

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = selectedOption === correctAnswer;
    setIsCorrect(result);
    console.log("Selected option:", selectedOption);
    console.log("Correct answer:", correctAnswer);
    console.log("Is correct?", result);
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
