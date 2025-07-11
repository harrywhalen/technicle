import TextBox from "./textbox.jsx";
import QuizBox from "./quizbox.jsx";



export default function RightSide({content, question, options, correctAnswer, isCorrect, setIsCorrect, handleSubmit, selectedOption, setSelectedOption, Qtype, 
  nextReady, setNextReady, advanceStep, tempBS}) {
  return (
<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'flex-start',
    margin: '0 1.5rem 0 2rem',         // 24px left, 15px right → rem units
    backgroundColor: '#ffffff',
    border: '3px solid #1f3a60',
    color: '#1f3a60',
    fontSize: '0.95rem',              // more consistent than em
    fontWeight: 'normal',
    lineHeight: '1.4',
    padding: '1rem',                  // 16px
    gap: '3.55rem',                   // 60px → rem
    borderRadius: '0.625rem',         // 10px → rem
    boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.1)', // 4px 8px → rem
    width: '100%',                    // ensure it scales down on mobile
    maxWidth: '600px',                // optional: prevent it from stretching too wide
    boxSizing: 'border-box',
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
