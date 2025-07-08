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
    TweakerStep,
  },
  ref  // <-- the forwarded ref is the 2nd parameter
) => {
  if (!currentStepContent) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        height: 'auto',
        width: '1600px',
        backgroundColor: '#e6f4f9',
        padding: '20px',
        marginLeft: '180px',
        borderRadius: '15px',
        boxShadow: '0 4px 18px rgba(0,0,0,0.1)',
        marginTop: '100px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '15px',
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
        />
      </div>
    </div>
  );
});

export default Big3;
