"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from "./sidebar.jsx";
import LessonName from "./lessonName.jsx";
import Big3 from "./big3.jsx";
import lessonData from "./data/lessondata.json"; // Import the JSON file

const rawOriginalData = [
  ['', '2014A', '2015A', '2016A', '2017A', '2018A', '2019P', '2020P', '2021P', '2022P'],
  ['Revenue', 2355, 3562, 4102, 4663, 5036, 5368, 5711, 5957, 6287],
  ['COGS', -1458, -2562, -2879, -3331, -3554, -3768, -4031, -4187, -4439],
  ['Gross Profit', 897, 1000, 1223, 1332, 1482, 1600, 1680, 1770, 1848],
  ['R&D Expense', -120, -135, -150, -162, -170, -176, -180, -184, -190],
  ['SG&A Expense', -60, -65, -70, -72, -78, -82, -85, -88, -90],
  ['EBITDA', 717, 800, 1003, 1098, 1234, 1342, 1415, 1498, 1568],
  ['Depreciation & Amort.', -43, -49, -75, -84, -88, -95, -100, -102, -110],
  ['EBIT', 674, 751, 928, 1014, 1146, 1247, 1315, 1396, 1458],
  ['Interest Expense', -45, -48, -52, -54, -56, -58, -60, -60, -60],
  ['EBT', 629, 703, 876, 960, 1090, 1189, 1255, 1336, 1398],
  ['Tax @ 25.2%', -159, -177, -221, -242, -275, -299, -317, -337, -352],
  ['Net Income', 470, 526, 655, 718, 815, 890, 938, 999, 1046],
  ['+ D&A', 43, 49, 75, 84, 88, 95, 100, 102, 110],
  ['- CapEx', -25, -28, -32, -35, -40, -45, -50, -55, -60],
  ['- Change in NWC', -2, -3, -4, -5, -6, -7, -8, -9, -10],
  ['Unlevered FCF', 486, 544, 694, 762, 857, 933, 980, 1037, 1086],
  ['Discount Factor (10%)', 1.00, 0.91, 0.83, 0.75, 0.68, 0.62, 0.56, 0.51, 0.47],
  ['Discounted FCF', 486, 495, 576, 572, 583, 578, 549, 529, 511],
  ['Terminal Value', '', '', '', '', '', '', '', '', 8030],
  ['Discounted TV', '', '', '', '', '', '', '', '', 3774],
];

const deepClone = (data) => data.map(row => [...row]);

export default function Module() {
  // Store originalData ONCE in state to protect it from accidental mutation
  const [initialData] = useState(() => deepClone(rawOriginalData));
  const [data, setData] = useState(() => deepClone(rawOriginalData));

  const refresh = () => {
    console.log("refresh triggered");
    setData(deepClone(initialData));
  };

  const [highlightOn, setHighlightOn] = useState(false);
  
  const [hintOn, setHintOn] = useState(false);

  const [currentActiveStepId, setCurrentActiveStepId] = useState('dcf-intro');
  const [currentStepContent, setCurrentStepContent] = useState(lessonData[currentActiveStepId]);

  useEffect(() => {
    const newContent = lessonData[currentActiveStepId];
    if (newContent) {
      setCurrentStepContent(newContent);
    } else {
      console.warn(`Content not found for step ID: ${currentActiveStepId}`);
      setCurrentStepContent(null);
    }
  }, [currentActiveStepId]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row' }}>
      <Sidebar onSectionChange={setCurrentActiveStepId} />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <LessonName />
        {currentStepContent ? (
          <Big3
            currentStepContent={currentStepContent}
            refresh={refresh}
            data={data}
            setData={setData}
            highlightOn={highlightOn}
            setHighlightOn={setHighlightOn}
            hintOn={hintOn}
            setHintOn={setHintOn}
          />
        ) : (
          <p style={{ color: '#1f3a60', textAlign: 'center', marginTop: '50px' }}>
            Loading lesson content...
          </p>
        )}
      </div>
    </div>
  );
}
