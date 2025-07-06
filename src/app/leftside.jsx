
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
}) {

  return (
    <div
    style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '10px'
}}
    >

          <LessonName />

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
          />

          <div>
            <HintBox hintOn={hintOn} setHintOn={setHintOn} hint={currentStepContent.hint} />
          </div>
        </div>

  );
}
