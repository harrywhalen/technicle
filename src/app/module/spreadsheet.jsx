"use client";

import React, { useRef, useEffect, useCallback } from 'react';
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

  const spreadsheetContainerRef = useRef(null);
  const isDestroyedRef = useRef(false);

  // Improved scroll prevention with better event handling
  const handleWheel = useCallback((e) => {
    // Only prevent default if we're actually scrolling within the spreadsheet bounds
    const container = spreadsheetContainerRef.current;
    if (!container) return;

    // Check if the mouse is actually over the spreadsheet container
    const rect = container.getBoundingClientRect();
    const isOverSpreadsheet = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );

    if (isOverSpreadsheet) {
      e.preventDefault();
      e.stopPropagation();
      
      // Get the spreadsheet's scrollable element - try multiple selectors
      let hotScrollableElement = container.querySelector('.wtHolder');
      
      // Fallback selectors if .wtHolder is not found
      if (!hotScrollableElement) {
        hotScrollableElement = container.querySelector('.ht_master .wtHolder');
      }
      if (!hotScrollableElement) {
        hotScrollableElement = container.querySelector('.handsontable .wtHolder');
      }
      if (!hotScrollableElement) {
        hotScrollableElement = container.querySelector('[data-scrollable-element]');
      }

      if (hotScrollableElement) {
        // Apply the scroll to the spreadsheet instead
        hotScrollableElement.scrollTop += e.deltaY;
        hotScrollableElement.scrollLeft += e.deltaX;
      } else {
        // If we can't find the scrollable element, try to get it from the Handsontable instance
        const hotInstance = hotTableComponent.current?.hotInstance;
        if (hotInstance && !isDestroyedRef.current) {
          const scrollableElement = hotInstance.view?.wt?.wtTable?.holder;
          if (scrollableElement) {
            scrollableElement.scrollTop += e.deltaY;
            scrollableElement.scrollLeft += e.deltaX;
          }
        }
      }
    }
  }, []);

  // Prevent page scrolling when hovering over spreadsheet - wait for Handsontable to be ready
  useEffect(() => {
    const container = spreadsheetContainerRef.current;
    if (!container) return;

    isDestroyedRef.current = false;
    let cleanupFunctions = [];

    // Function to set up scroll prevention
    const setupScrollPrevention = () => {
      const hotInstance = hotTableComponent.current?.hotInstance;
      
      // Only proceed if Handsontable is fully initialized and not destroyed
      if (!hotInstance || isDestroyedRef.current) {
        // Retry after a short delay, but only if component hasn't been destroyed
        if (!isDestroyedRef.current) {
          const retryTimeout = setTimeout(setupScrollPrevention, 100);
          cleanupFunctions.push(() => clearTimeout(retryTimeout));
        }
        return;
      }

      // Add wheel event listener with passive: false to allow preventDefault
      container.addEventListener('wheel', handleWheel, { 
        passive: false,
        capture: true
      });

      // Also add to document as a backup
      document.addEventListener('wheel', handleWheel, { 
        passive: false,
        capture: true
      });

      cleanupFunctions.push(() => {
        container.removeEventListener('wheel', handleWheel, { capture: true });
        document.removeEventListener('wheel', handleWheel, { capture: true });
      });

      // Remove the problematic render call that was causing the error
      // The render call is not necessary here and was causing issues when called on destroyed instances
    };

    // Start the setup process
    setupScrollPrevention();

    return () => {
      isDestroyedRef.current = true;
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [handleWheel, data, activeTab]); // Include data and activeTab to re-setup when component updates

  // Column headers for the years
  const colHeaders = [
    'Metric', '2014A', '2015A', '2016A', '2017A', '2018P',
    '2019P', '2020P', '2021P', '2022P'
  ];

  // Generate column letters (A, B, C, etc.)
  const generateColumnLetters = (count) => {
    const letters = [];
    for (let i = 0; i < count; i++) {
      if (i < 26) {
        letters.push(String.fromCharCode(65 + i)); // A-Z
      } else {
        // For columns beyond Z, use AA, AB, AC, etc.
        const firstLetter = String.fromCharCode(64 + Math.floor(i / 26));
        const secondLetter = String.fromCharCode(65 + (i % 26));
        letters.push(firstLetter + secondLetter);
      }
    }
    return letters;
  };

  const columnLetters = generateColumnLetters(colHeaders.length);

  // Nested headers: [column letters row, year headers row]
  const nestedHeaders = [
    columnLetters,
    colHeaders
  ];

  const afterChange = (changes, source) => {
    if (changes && source !== 'loadData') {
      changes.forEach(([row, col]) => {
        console.log(`Cell changed: row ${row}, col ${col}`);
      });
    }
  };

  // Handsontable lifecycle hook to ensure scroll prevention is set up
  const afterInit = () => {
    console.log('Handsontable initialized - scroll prevention ready');
    // Remove the problematic setTimeout that was calling render on potentially destroyed instances
    const container = spreadsheetContainerRef.current;
    if (container) {
      // Trigger a custom event to let our effect know Handsontable is ready
      container.dispatchEvent(new CustomEvent('handsontable-ready'));
    }
  };

  // Add beforeDestroy hook to mark the instance as destroyed
  const beforeDestroy = () => {
    isDestroyedRef.current = true;
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
      ref={spreadsheetContainerRef}
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
        nestedHeaders={nestedHeaders}
        rowHeaders={true}
        autoRowSize={true}
        licenseKey="non-commercial-and-evaluation"
        stretchH="all"
        width="100%"
        height="46vh"
        readOnly={false}
        contextMenu={true}
        afterChange={afterChange}
        afterInit={afterInit}
        beforeDestroy={beforeDestroy}
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