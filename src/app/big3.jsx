"use client"
import React, { useState, useEffect } from 'react';
import TextBox from "./textbox.jsx";
import QuizBox from "./quizbox.jsx";
import Spreadsheet from "./spreadsheet.jsx";
import SpreadsheetTabs from "./spreadsheetTabs.jsx";
import RightSide from "./rightside.jsx";

export default function Big3({currentStepContent}) {
if (!currentStepContent) {
    return <div>Loading...</div>; // or null, or a spinner
  }
return(
<div
style={{
height: 'auto',
width: '1590px',
backgroundColor: '#e6f4f9',
padding: '20px',
marginLeft: '180px',
borderRadius: '15px',
boxShadow: '0 4px 18px rgba(0,0,0,0.1)',
}}
>
<div
style={{
display: 'flex',
flexDirection: 'row',
gap: '80px',
}}
>
<div
style={{
display: 'flex',
flexDirection: 'column',
}}
>
<SpreadsheetTabs/>
<Spreadsheet/>
</div>


<div
style={{
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
//justifyContent: 'center',
gap: '100px',
}}
>
<RightSide  
content={currentStepContent.textBoxContent} 
question={currentStepContent.quiz.question}
options={currentStepContent.quiz.options}
correctAnswer={currentStepContent.quiz.correctAnswer}
/>
</div>
</div>


</div>

)

}


