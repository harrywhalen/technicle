import TextBox from "./textbox.jsx";
import QuizBox from "./quizbox.jsx";


export default function RightSide({content, question, options, correctAnswer}) {
  return (
    <div
    style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  
    height: 'auto',
    backgroundColor: '#ffffff',
    borderColor: '#1f3a60',
    borderWidth: '3px', // Changed to 3px to match QuizBox and other elements
    borderStyle: 'solid',
    color: '#1f3a60',
    // Adjusted font size and weight to be more suitable for body text
    fontSize: '0.95em', // Adjust font size relative to parent
    fontWeight: 'normal', // Standard font weight for body text
    lineHeight: '1.4', // Improved line spacing for readability
    padding: '15px',
    justifyContent: 'center',
    gap: '60px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
}}
    >


        
    <TextBox content={content} />


    <QuizBox
        question={question}
        options={options}
        correctAnswer={correctAnswer}

    />

    

    </div>

  );
}
