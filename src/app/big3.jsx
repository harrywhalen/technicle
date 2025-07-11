"use client";
import React, { forwardRef } from 'react';
import RightSide from "./rightside.jsx";
import LeftSide from "./leftside.jsx";
import SpreadGang from "./spreadGang.jsx";
import HintBox from "./hintbox.jsx";


const Big3 = forwardRef((
  {
    currentStepContent,
    data,
    setData,
    highlightOn,
    setHighlightOn,
    hintOn,
    setHintOn,
    isCorrect,
    setIsCorrect,
    handleSubmit,
    selectedOption,
    setSelectedOption,
    refresh,
    sheetQuizCells,
    sheetBlankCells,
    handleTabChange,
    activeTab,
    sheetsData,
    setSheetsData,
    sheetsInitialData,
    setSheetsInitialData,
    sheetsDisplayData,
    setSheetsDisplayData,
    Qtype,
    TargetTab,
    nextReady,
    setNextReady,
    advanceStep,
    currentActiveStepId,
    playSound,
    highestStep,
    totalSteps,
    tempBS,
    showCoordinates,
    hotTableComponent,
    tabLocked,
    sheetBlankForecasts,
  },
  ref  // <-- the forwarded ref is the 2nd parameter
) => {
  if (!currentStepContent) {
    return <div>Loading...</div>;
  }
console.log("In big3 showCoordinates:", typeof showCoordinates);
console.log("Rendering Big3 - about to render LeftSide");
  return (
<div
  style={{
    height: 'auto',
    width: '86vw', // 1600px → responsive to viewport
    maxWidth: '100%', // Prevents overflow
    backgroundColor: '#e6f4f9',
    padding: '1.25rem', // 20px → rem
    marginLeft: '10vw', // 180px → approx relative to screen
    borderRadius: '0.9375rem', // 15px → rem
    boxShadow: '0 0.25rem 1.125rem rgba(0, 0, 0, 0.1)', // 4px 18px → rem
    marginTop: '6.25rem', // 100px → rem
    boxSizing: 'border-box',
  }}
>
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '0.9375rem', // 15px → rem
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      
          <LeftSide
            data={data}
            setData={setData}
            highlightOn={highlightOn}
            setHighlightOn={setHighlightOn}
            hintOn={hintOn}
            setHintOn={setHintOn}
            currentStepContent={currentStepContent}
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
            currentActiveStepId={currentActiveStepId}
            ref={ref} // <-- forward ref here
            playSound={playSound}
            highestStep={highestStep}
            totalSteps={totalSteps}
            showCoordinates={showCoordinates}
            hotTableComponent ={hotTableComponent }
            tabLocked={tabLocked}
            sheetBlankForecasts={sheetBlankForecasts}
          />

        </div>

        <RightSide
          content={currentStepContent.textBoxContent}
          question={currentStepContent.quiz.question}
          options={currentStepContent.quiz.options}
          correctAnswer={currentStepContent.quiz.correctAnswer}
          isCorrect={isCorrect}
          setIsCorrect={setIsCorrect}
          handleSubmit={handleSubmit}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          Qtype={Qtype}
          nextReady={nextReady}
          setNextReady={setNextReady}
          advanceStep={advanceStep}
          tempBS={tempBS}
        />
      </div>
    </div>
  );
});

export default Big3;
