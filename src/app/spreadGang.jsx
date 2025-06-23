"use client"
import React, { useState, useEffect, useRef } from 'react';
import Spreadsheet from "./spreadsheet.jsx";
import Spreadbutt from "./spreadbutt.jsx";
import SpreadsheetTabs from "./spreadsheetTabs.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase.js";


export default function SpreadGang({highlightOn, setHighlightOn, hintOn, setHintOn,}) {

    const correctAnswers = { "1,1": "2355" };
    const hotTableComponent = useRef(null);

    const [data, setData] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    


    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "models", "defaultModel");
                const docSnap = await getDoc(docRef);

                const ColddocRef = doc(db, "models", "defaultModel");
                const ColddocSnap = await getDoc(ColddocRef);
                
                if (docSnap.exists()) {
                    const orderedData = docSnap.data().orderedData;
                    const coldorderedData = ColddocSnap.data().orderedData;
                    // Convert from Firebase format to Handsontable format
                    // Each item in orderedData has { label, values }
                    const hotFormat = orderedData.map(item => [item.label, ...item.values]);
                    const coldFormat = coldorderedData.map(item => [item.label, ...item.values]);
                    setData(hotFormat);
                    setInitialData(coldFormat);
                } else {
                    console.log("No document found lil fella!");
                    setData([]); // Empty data if no document
                }
                
                setDataLoading(false);
                
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]); // Empty data on error
                setDataLoading(false);
            }
        };

        fetchData();
    }, []);

const refresh = () => {
    console.log("refresh triggered");
    // Create a deep copy to avoid reference issues
    const resetData = initialData.map(row => [...row]);
    setData(resetData);
    console.log("Reset to:", resetData);
};

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
dataLoading = {dataLoading}
hotTableComponent = {hotTableComponent}
refresh = {refresh}
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


