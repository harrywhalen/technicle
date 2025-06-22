"use client"
import React, { useState, useEffect } from 'react';
import RightSide from "./rightside.jsx";
import SpreadGang from "./spreadGang.jsx";
import HintBox from "./hintbox.jsx";

export default function Big3({currentStepContent, refresh, data, setData, highlightOn, setHighlightOn, hintOn, setHintOn}) {
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
gap: '10px',
}}
>

<SpreadGang
refresh = {refresh}
data = {data} 
setData = {setData}
highlightOn = {highlightOn}
setHighlightOn = {setHighlightOn}
hintOn={hintOn}
setHintOn={setHintOn}
/>



<div
style={{
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
//justifyContent: 'center',
gap: '0px',
}}
>

  <RightSide  
content={currentStepContent.textBoxContent} 
question={currentStepContent.quiz.question}
options={currentStepContent.quiz.options}
correctAnswer={currentStepContent.quiz.correctAnswer}
/>

<div>
<HintBox
hintOn={hintOn}
setHintOn={setHintOn}
/>
</div>




</div>
</div>


</div>

)

}


