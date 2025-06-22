"use client"
import React, { useState, useEffect } from 'react';
import Spreadsheet from "./spreadsheet.jsx";
import Spreadbutt from "./spreadbutt.jsx";
import SpreadsheetTabs from "./spreadsheetTabs.jsx";


export default function SpreadGang({refresh, data, setData, highlightOn, setHighlightOn, hintOn, setHintOn}) {

return(

<div
style={{
display: 'flex',
flexDirection: 'column',
}}
>
<SpreadsheetTabs/>
<Spreadsheet
data = {data} 
setData = {setData}
highlightOn = {highlightOn}
setHighlightOn = {setHighlightOn}
/>
<Spreadbutt
refresh = {refresh}
data = {data} 
setData = {setData}
highlightOn = {highlightOn}
setHighlightOn = {setHighlightOn}
hintOn={hintOn}
setHintOn={setHintOn}
/>
</div>



)

}


