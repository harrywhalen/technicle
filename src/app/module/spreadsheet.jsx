"use client";

import React from 'react';
import { HotTable } from '@handsontable/react';
import { HyperFormula } from 'hyperformula';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import lessonData from "../data/lessondata.json"; // Import the JSON file

import './globals.css';

registerAllModules();

export default function Spreadsheet({
  highlightOn,
  setHighlightOn,
  dataLoading,
  hotTableComponent,
  data,
  setData,
  initialData,
  refresh,
  currentStepContent,
  activeTab,
  preAnswer,
  correctCellsROW,
  correctCellsCOL,
  incorrectCellsROW,
  incorrectCellsCOL,
  clearCellsArrays,
  
}) {


  // Column headers for the years
  const colHeaders = [
    'Metric', '2014A', '2015A', '2016A', '2017A', '2018P',
    '2019P', '2020P', '2021P', '2022P'
  ];

  const afterChange = (changes, source) => {
    if (changes && source !== 'loadData') {
      changes.forEach(([row, col]) => {
        console.log(`Cell changed: row ${row}, col ${col}`);
      });
    }
  };

  // Pad data to minimum 15 rows
  const minRows = 20;
  const numCols = colHeaders.length;
  const paddedData = [...data];
  while (paddedData.length < minRows) {
    paddedData.push(new Array(numCols).fill(''));
  }

  // Show loading state
  if (dataLoading) {
    return (
      <div style={{
        width: '52.1vw',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        border: '3px solid #1f3a60',
        zIndex: '1',
      }}>
        Loading spreadsheet...
      </div>
    );
  }

  return (
    <div
      style={{
        width: '52.1vw',
        backgroundColor: '#ffffff',
        border: '3px solid #1f3a60',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}
      className="custom-scroll-table" // 👈 Add this class
    >
      <HotTable
        ref={hotTableComponent}
        data={paddedData}
        colHeaders={colHeaders}
        rowHeaders={false} // Disabled row headers since first column contains labels
        autoRowSize={true}
        licenseKey="non-commercial-and-evaluation"
        stretchH="all"
        width="100%"
        height="46vh"
        readOnly={false}
        contextMenu={true}
        afterChange={afterChange}
        manualRowResize={true}
        manualColumnResize={true}
        columnSorting={true}
        formulas={{
          engine: HyperFormula,
        }}
        columns={[
          {
            data: 0,
            type: 'text',
            readOnly: true,
            className: 'htLeft htMiddle',
            width: 150,
          },
          ...Array.from({ length: 9 }, (_, index) => ({
            data: index + 1,
            type: 'numeric',
            numericFormat: {
              pattern: '0,0',
            },
            className: 'htRight htMiddle',
          })),
        ]}
        cells={(row, col) => {
          const classes = [];

          // Zebra striping
          if (row % 2 === 1 && !correctCellsROW.includes(row) && !incorrectCellsROW.includes(row)) {
            classes.push('even-row');
          }

          if (currentStepContent.highlightRow && currentStepContent.highlightRow.tab === activeTab) {
          if (row === currentStepContent.highlightRow.row) {
              classes.push('quizcel');
            }
          }

          if (currentStepContent.Qtype === "cells") {
            for (let i = 1; i <= 6; i++) {
              const quizCel = currentStepContent[`Quizcel_${i}`];
              if (
                quizCel?.tab === activeTab &&
                quizCel.row === row &&
                quizCel.column === col
              ) {
                if (preAnswer) {
                  classes.push('quizcel');
                } else if (incorrectCellsCOL.includes(col) && incorrectCellsROW.includes(row)) {
                  classes.push('incorrect-cell');
                } else if (correctCellsCOL.includes(col) && correctCellsROW.includes(row)) {
                  console.log("MISSION SUCCESS")
                  console.log("Classes", classes)
                  classes.push('correct-cell');
                }
              }
            }
          }

          if (highlightOn) {
            //if (row === 2 && col === 1) {
              //classes.push('shimmer-cell');
            //}
            if (col >= 5) {
              classes.push('forecasted-cell');
            }
            if (col >= 1 && (row === 2 || row === 4 || row === 8 || row === 10)) {
              classes.push('derived-cell');
            }

          }
          
          

          return {
            className: classes.join(' '),
          };
        }}
      />
    </div>
  );
}
