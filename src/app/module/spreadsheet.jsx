"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
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
}) {
  const spreadsheetContainerRef = useRef(null);
  const [isFormulaMode, setIsFormulaMode] = useState(false);
  const [formulaEditingCell, setFormulaEditingCell] = useState(null);
  const [copyCellSelection, setCopyCellSelection] = useState(null); // {row, col}

  // Function to convert row/col coordinates to Excel-style cell reference
  const getCellReference = (row, col) => {
    const generateColumnLetters = (colIndex) => {
      let result = '';
      while (colIndex >= 0) {
        result = String.fromCharCode(65 + (colIndex % 26)) + result;
        colIndex = Math.floor(colIndex / 26) - 1;
      }
      return result;
    };
    
    const colLetter = generateColumnLetters(col);
    return `${colLetter}${row + 1}`;
  };

  // Clear copy cell selection when formula mode ends or operator is added
  const clearCopyCellSelection = useCallback(() => {
    setCopyCellSelection(null);
  }, []);

  // Handle cell selection during formula mode
  const handleCellClick = useCallback((row, col, hotInstance) => {
    if (isFormulaMode && formulaEditingCell) {
      // Set the copy cell selection to show dotted border
      setCopyCellSelection({ row, col });
      
      // Prevent default cell selection
      const cellRef = getCellReference(row, col);
      
      // Get the current editor content
      const editor = hotInstance.getActiveEditor();
      if (editor && editor.isOpened()) {
        const currentValue = editor.getValue() || '';
        
        // Replace the cell reference instead of appending
        // Find the last complete cell reference and replace it, or append if none exists
        const cellRefPattern = /[A-Z]+\d+$/;
        let newValue;
        
        if (cellRefPattern.test(currentValue.trim())) {
          // Replace the last cell reference
          newValue = currentValue.replace(cellRefPattern, cellRef);
        } else {
          // Append the cell reference
          newValue = currentValue + cellRef;
        }
        
        // Update the editor with the cell reference
        editor.setValue(newValue);
        
        // Focus back to the editor and position cursor at the end
        setTimeout(() => {
          if (editor.TEXTAREA) {
            editor.TEXTAREA.focus();
            editor.TEXTAREA.setSelectionRange(newValue.length, newValue.length);
          }
        }, 0);
        
        // Return false to prevent the cell selection from changing
        return false;
      }
    }
    return true;
  }, [isFormulaMode, formulaEditingCell]);

  // Handle arrow key navigation for copy cell selection
  const handleArrowKeyNavigation = useCallback((event, hotInstance) => {
    if (!isFormulaMode || !formulaEditingCell) return true;

    const editor = hotInstance.getActiveEditor();
    if (!editor || !editor.isOpened()) return true;

    // Check for arrow keys (with or without Ctrl for navigation)
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      let currentCopyCell = copyCellSelection;
      
      // If no copy cell is selected, start from the editing cell
      if (!currentCopyCell) {
        currentCopyCell = { row: formulaEditingCell.row, col: formulaEditingCell.col };
      }

      let newRow = currentCopyCell.row;
      let newCol = currentCopyCell.col;

      // Calculate new position based on arrow key
      switch (event.key) {
        case 'ArrowUp':
          newRow = Math.max(0, newRow - 1);
          break;
        case 'ArrowDown':
          newRow = Math.min(hotInstance.countRows() - 1, newRow + 1);
          break;
        case 'ArrowLeft':
          newCol = Math.max(0, newCol - 1);
          break;
        case 'ArrowRight':
          newCol = Math.min(hotInstance.countCols() - 1, newCol + 1);
          break;
      }

      // Update copy cell selection
      const newCopyCell = { row: newRow, col: newCol };
      setCopyCellSelection(newCopyCell);

      // Replace or add cell reference to formula
      const cellRef = getCellReference(newRow, newCol);
      const currentValue = editor.getValue() || '';
      
      // Replace the cell reference instead of appending
      const cellRefPattern = /[A-Z]+\d+$/;
      let newValue;
      
      if (cellRefPattern.test(currentValue.trim())) {
        // Replace the last cell reference
        newValue = currentValue.replace(cellRefPattern, cellRef);
      } else {
        // Append the cell reference
        newValue = currentValue + cellRef;
      }
      
      editor.setValue(newValue);

      // Keep focus on editor
      setTimeout(() => {
        if (editor.TEXTAREA) {
          editor.TEXTAREA.focus();
          editor.TEXTAREA.setSelectionRange(newValue.length, newValue.length);
        }
      }, 0);

      return false;
    }

    return true;
  }, [isFormulaMode, formulaEditingCell, copyCellSelection]);

  // Monitor editor content for operators to clear copy selection
  const monitorEditorContent = useCallback(() => {
    if (!isFormulaMode || !formulaEditingCell) return;

    const hotInstance = hotTableComponent.current?.hotInstance;
    if (!hotInstance) return;

    const editor = hotInstance.getActiveEditor();
    if (!editor || !editor.isOpened()) return;

    const currentValue = editor.getValue() || '';
    const operators = ['+', '-', '*', '/', '(', ')', ',', ' '];
    
    // Check if the last character is an operator
    const lastChar = currentValue.slice(-1);
    if (operators.includes(lastChar)) {
      clearCopyCellSelection();
    }
  }, [isFormulaMode, formulaEditingCell, clearCopyCellSelection]);

  // Handle entering formula mode when user types =
  const handleKeyDown = useCallback((event) => {
    const hotInstance = hotTableComponent.current?.hotInstance;
    if (!hotInstance) return;

    // Handle arrow key navigation for copy cell selection
    if (isFormulaMode) {
      const arrowResult = handleArrowKeyNavigation(event, hotInstance);
      if (!arrowResult) return; // Arrow key was handled
    }

    const selected = hotInstance.getSelected();
    if (!selected || selected.length === 0) return;

    const [row, col] = selected[0];
    
    // Check if we're starting a formula
    if (event.key === '=' && !isFormulaMode) {
      setIsFormulaMode(true);
      setFormulaEditingCell({ row, col });
      setCopyCellSelection(null); // Clear any existing copy selection
    }

    // Handle ESC key to exit formula mode
    if (event.key === 'Escape' && isFormulaMode) {
      setIsFormulaMode(false);
      setFormulaEditingCell(null);
      clearCopyCellSelection();
      // Let Handsontable handle the ESC key naturally
      return;
    }

    // Monitor for operators being typed
    if (isFormulaMode) {
      setTimeout(monitorEditorContent, 0);
    }
  }, [isFormulaMode, handleArrowKeyNavigation, monitorEditorContent, clearCopyCellSelection]);

  // Handle exiting formula mode when cell value changes (Enter pressed)
  const handleAfterChange = useCallback((changes, source) => {
    if (changes && source !== 'loadData') {
      changes.forEach(([row, col, oldValue, newValue]) => {
        console.log(`Cell changed: row ${row}, col ${col}`);
        
        // Exit formula mode when the cell value is committed (Enter pressed)
        if (isFormulaMode && formulaEditingCell && 
            formulaEditingCell.row === row && formulaEditingCell.col === col) {
          // Always exit formula mode when the cell value changes (formula committed)
          setIsFormulaMode(false);
          setFormulaEditingCell(null);
          clearCopyCellSelection();
        }
      });
    }
  }, [isFormulaMode, formulaEditingCell, clearCopyCellSelection]);

  // Handle editor state changes
  const handleAfterBeginEditing = useCallback((row, col) => {
    const hotInstance = hotTableComponent.current?.hotInstance;
    if (!hotInstance) return;

    const cellValue = hotInstance.getDataAtCell(row, col);
    if (cellValue && cellValue.toString().startsWith('=')) {
      setIsFormulaMode(true);
      setFormulaEditingCell({ row, col });
      setCopyCellSelection(null); // Clear copy selection when starting to edit existing formula
    }
  }, []);

  // Handle exiting formula mode when editing ends (Enter, Escape, or clicking elsewhere)
  const handleAfterDeselect = useCallback(() => {
    if (isFormulaMode) {
      setIsFormulaMode(false);
      setFormulaEditingCell(null);
      clearCopyCellSelection();
    }
  }, [isFormulaMode, clearCopyCellSelection]);

  // Enhanced cell click handler that integrates with Handsontable
  const handleBeforeOnCellMouseDown = useCallback((event, coords, TD) => {
    const hotInstance = hotTableComponent.current?.hotInstance;
    if (!hotInstance) return;

    if (isFormulaMode && formulaEditingCell) {
      // Prevent the default cell selection
      event.stopImmediatePropagation();
      
      // Set copy cell selection
      setCopyCellSelection({ row: coords.row, col: coords.col });
      
      const cellRef = getCellReference(coords.row, coords.col);
      const editor = hotInstance.getActiveEditor();
      
      if (editor && editor.isOpened()) {
        const currentValue = editor.getValue() || '';
        
        // Replace the cell reference instead of appending
        const cellRefPattern = /[A-Z]+\d+$/;
        let newValue;
        
        if (cellRefPattern.test(currentValue.trim())) {
          // Replace the last cell reference
          newValue = currentValue.replace(cellRefPattern, cellRef);
        } else {
          // Append the cell reference
          newValue = currentValue + cellRef;
        }
        
        editor.setValue(newValue);
        
        // Keep focus on the editor
        setTimeout(() => {
          if (editor.TEXTAREA) {
            editor.TEXTAREA.focus();
            editor.TEXTAREA.setSelectionRange(newValue.length, newValue.length);
            // Monitor for operators after cell reference is added
            monitorEditorContent();
          }
        }, 0);
      }
    }
  }, [isFormulaMode, formulaEditingCell, monitorEditorContent]);

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
        if (hotInstance) {
          const scrollableElement = hotInstance.view.wt.wtTable.holder;
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

    let cleanupFunctions = [];

    // Function to set up scroll prevention
    const setupScrollPrevention = () => {
      const hotInstance = hotTableComponent.current?.hotInstance;
      
      // Only proceed if Handsontable is fully initialized
      if (!hotInstance) {
        // Retry after a short delay
        const retryTimeout = setTimeout(setupScrollPrevention, 100);
        cleanupFunctions.push(() => clearTimeout(retryTimeout));
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

      // Force a render to ensure all DOM elements are available
      setTimeout(() => {
        if (hotInstance) {
          hotInstance.render();
        }
      }, 50);
    };

    // Start the setup process
    setupScrollPrevention();

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [handleWheel, data, activeTab]); // Include data and activeTab to re-setup when component updates

  // Column headers for the years
  const colHeaders = [
    'Metric', '2014A', '2015A', '2016A', '2017A', '2018A',
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
    handleAfterChange(changes, source);
  };

  // Handsontable lifecycle hook to ensure scroll prevention is set up
  const afterInit = () => {
    console.log('Handsontable initialized - scroll prevention ready');
    // Force a small delay to ensure DOM is fully ready
    setTimeout(() => {
      const container = spreadsheetContainerRef.current;
      if (container) {
        // Trigger a custom event to let our effect know Handsontable is ready
        container.dispatchEvent(new CustomEvent('handsontable-ready'));
      }
    }, 50);
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
        afterBeginEditing={handleAfterBeginEditing}
        afterDeselect={handleAfterDeselect}
        beforeOnCellMouseDown={handleBeforeOnCellMouseDown}
        beforeKeyDown={handleKeyDown}
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
          if (row % 2 === 1) {
            classes.push('even-row');
          }

          // Add visual indicator for formula mode
          if (isFormulaMode && formulaEditingCell && 
              formulaEditingCell.row === row && formulaEditingCell.col === col) {
            classes.push('formula-editing');
          }

          // Add copy cell selection styling (dotted border)
          if (copyCellSelection && 
              copyCellSelection.row === row && copyCellSelection.col === col) {
            classes.push('copy-cell-selected');
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
                classes.push('quizcel');
                break;
              }
            }
          }

          if (highlightOn) {
            if (row === 2 && col === 1) {
              classes.push('shimmer-cell');
            }
            if (col >= 6) {
              classes.push('forecasted-cell');
            }
            if (col >= 1 && (row === 6 || row === 8)) {
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