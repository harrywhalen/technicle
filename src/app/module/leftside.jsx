"use client"
import SpreadGang from "./spreadGang.jsx";
import HintBox from "./hintbox.jsx";
import LessonName from "./lessonName.jsx";
import DaProg from "./modProgBizzy.jsx";


export default function LeftSide({
data,
setData,
highlightOn,
setHighlightOn,
hintOn,
setHintOn,
currentStepContent,
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
currentActiveStepId,
ref,
playSound,
highestStep,
totalSteps,
showCoordinates,
hotTableComponent,
tabLocked,
sheetBlankForecasts,
content,
preAnswer,
getIncorrectCellsROW,
setPreAnswer,
setCorrectCellsROW,
correctCellsCOL, 
setCorrectCellsCOL, 
incorrectCellsROW,
setIncorrectCellsROW, 
incorrectCellsCOL, 
setIncorrectCellsCOL,
updateME,
SpreadSheet_Selector,
}) {

  return (
    <div
    style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: '.15vw',

}}
    >

          <LessonName 
          content = {content}
          />

          <DaProg
          highestStep={highestStep}
          totalSteps={totalSteps}
          />
        
          <SpreadGang
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
            ref={ref}  // <-- forward ref here
            playSound={playSound}
            highestStep={highestStep}
            showCoordinates={showCoordinates}
            hotTableComponent ={hotTableComponent }
            tabLocked={tabLocked}
            sheetBlankForecasts={sheetBlankForecasts}
            content = {content}
            preAnswer={preAnswer}
            incorrectCellsROW = {incorrectCellsROW}
            incorrectCellsCOL = {incorrectCellsCOL}
            getIncorrectCellsROW={getIncorrectCellsROW}
            setPreAnswer={setPreAnswer}
            setCorrectCellsCOL = {setCorrectCellsCOL}
            setIncorrectCellsROW = {setIncorrectCellsROW}
            setIncorrectCellsCOL = {setIncorrectCellsCOL}
            updateME={updateME}
            SpreadSheet_Selector={SpreadSheet_Selector}
          />

          <div>
            <HintBox hintOn={hintOn} setHintOn={setHintOn} hint={currentStepContent.hint} />
          </div>
        </div>

  );
}
