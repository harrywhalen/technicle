import TextBox from "./textbox.jsx";
import QuizBox from "./quizbox.jsx";

export default function RightSide({
  content,
  question,
  options,
  correctAnswer,
  isCorrect,
  setIsCorrect,
  handleSubmit,
  selectedOption,
  setSelectedOption,
  Qtype,
  nextReady,
  setNextReady,
  advanceStep,
  tempBS
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#ffffff',
        border: '3px solid #1f3a60',
        color: '#1f3a60',
        fontSize: 'clamp(0.7rem, 0.5vw, 1.1rem)',
        fontWeight: 'normal',
        lineHeight: '1.4',
        padding: '1rem',
        gap: 'clamp(1rem, 3vw, 2rem)', // Responsive gap that scales with screen size
        borderRadius: '0.625rem',
        boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.1)',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <TextBox content={content} />
      <QuizBox
        question={question}
        options={options}
        correctAnswer={correctAnswer}
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
  );
}