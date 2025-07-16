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
  ref
) => {
  if (!currentStepContent) return <div>Loading...</div>;

  return (
    <div
      style={{
        marginTop: '10vh', // Push below top bar
        marginLeft: '10vw', // Push beside sidebar
        width: 'calc(100vw - 10vw)',
        minHeight: '85vh', // allow space for feedback bar below
        backgroundColor: '#e6f4f9',
        padding: '1rem',
        borderRadius: '1rem',
        boxShadow: '0 0.5rem 2rem rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
          height: '100%',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 60%',
            minWidth: '0',
            overflow: 'hidden',
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
            ref={ref}
            playSound={playSound}
            highestStep={highestStep}
            totalSteps={totalSteps}
            showCoordinates={showCoordinates}
            hotTableComponent={hotTableComponent}
            tabLocked={tabLocked}
            sheetBlankForecasts={sheetBlankForecasts}
          />
        </div>

        <div
          style={{
            flex: '0 0 40%',
            minWidth: '20rem',
            maxWidth: '35rem',
            overflow: 'hidden',
          }}
        >
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
    </div>
  );
});

export default Big3;
