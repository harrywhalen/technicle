"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { HyperFormula } from 'hyperformula';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import lessonData from "../data/lessondata.json";

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
  incorrectCellsROW,
  correctCellsROW,
}) {
  const spreadsheetContainerRef = useRef(null);
  const [isFormulaMode, setIsFormulaMode] = useState(false);
  const [formulaEditingCell, setFormulaEditingCell] = useState(null);
  const [copyCellSelection, setCopyCellSelection] = useState(null);
  const editorMonitoringRef = useRef(null);

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

  // Clear copy cell selection
  const clearCopyCellSelection = useCallback(() => {
    setCopyCellSelection(null);
  }, []);

  // Check if we're in a formula - very simple check
  const isInFormula = useCallback((editor) => {
    if (!editor || !editor.isOpened()) return false;
    
    const currentValue = editor.getValue() || '';
    return currentValue.startsWith('=');
  }, []);

  // Always enable copy cell if we're in formula mode and it's a formula
  const shouldEnableCopyCell = useCallback((editor) => {
    if (!isFormulaMode || !formulaEditingCell) return false;
    if (!editor || !editor.isOpened()) return false;
    
    const currentValue = editor.getValue() || '';
    
    // If it starts with =, always allow copy cell
    return currentValue.startsWith('=');
  }, [isFormulaMode, formulaEditingCell]);

  // Start comprehensive editor monitoring
  const startEditorMonitoring = useCallback((editor) => {
    if (!editor || !editor.TEXTAREA || editorMonitoringRef.current) return;
    
    console.log('Starting editor monitoring');
    
    const handleEditorChange = () => {
      // Don't exit formula mode from editor changes - only from explicit actions
      console.log('Editor changed, staying in formula mode');
    };

    // Monitor editor events but don't exit formula mode
    const events = ['input', 'keyup', 'click', 'focus', 'selectionchange'];
    events.forEach(eventType => {
      editor.TEXTAREA.addEventListener(eventType, handleEditorChange);
    });

    // Store cleanup function
    editorMonitoringRef.current = () => {
      console.log('Stopping editor monitoring');
      events.forEach(eventType => {
        if (editor.TEXTAREA) {
          editor.TEXTAREA.removeEventListener(eventType, handleEditorChange);
        }
      });
    };
  }, []);

  // Stop monitoring editor
  const stopEditorMonitoring = useCallback(() => {
    if (editorMonitoringRef.current) {
      editorMonitoringRef.current();
      editorMonitoringRef.current = null;
    }
  }, []);

  // Enter formula mode - be aggressive about staying in it
  const enterFormulaMode = useCallback((row, col) => {
    console.log('Entering formula mode for cell:', row, col);
    setIsFormulaMode(true);
    setFormulaEditingCell({ row, col });
    setCopyCellSelection(null);
    
    // Start monitoring immediately and repeatedly check
    const startMonitoring = () => {
      const hotInstance = hotTableComponent.current?.hotInstance;
      if (hotInstance) {
        const editor = hotInstance.getActiveEditor();
        if (editor && editor.isOpened() && editor.TEXTAREA) {
          console.log('Editor is ready for monitoring');
          startEditorMonitoring(editor);
          return true;
        }
      }
      return false;
    };
    
    // Try multiple times to ensure we catch the editor
    let attempts = 0;
    const maxAttempts = 20;
    const tryStartMonitoring = () => {
      if (startMonitoring()) {
        console.log('Successfully started monitoring after', attempts + 1, 'attempts');
        return;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(tryStartMonitoring, 25);
      } else {
        console.warn('Failed to start editor monitoring after', maxAttempts, 'attempts');
      }
    };
    
    tryStartMonitoring();
  }, [startEditorMonitoring]);

  // Exit formula mode - only call this when truly done
  const exitFormulaMode = useCallback(() => {
    console.log('Exiting formula mode');
    setIsFormulaMode(false);
    setFormulaEditingCell(null);
    clearCopyCellSelection();
    stopEditorMonitoring();
  }, [clearCopyCellSelection, stopEditorMonitoring]);

  // Handle cell selection during formula mode - always allow
  const handleCellClick = useCallback((row, col, hotInstance) => {
    console.log('Cell clicked:', row, col, 'Formula mode:', isFormulaMode);
    
    if (isFormulaMode && formulaEditingCell) {
      const editor = hotInstance.getActiveEditor();
      
      // Always allow cell selection in formula mode if editor is active
      if (!editor || !editor.isOpened()) {
        console.log('Editor not open, ignoring click');
        return true;
      }
      
      console.log('Processing cell click for formula');
      
      // Set the copy cell selection to show dotted border
      setCopyCellSelection({ row, col });
      
      const cellRef = getCellReference(row, col);
      
      const currentValue = editor.getValue() || '';
      const cursorPosition = editor.TEXTAREA ? editor.TEXTAREA.selectionStart : currentValue.length;
      
      console.log('Current formula state:', { currentValue, cursorPosition });
      
      // Insert or replace cell reference at cursor position
      const beforeCursor = currentValue.substring(0, cursorPosition);
      const afterCursor = currentValue.substring(cursorPosition);
      
      // Check if we should replace an existing cell reference
      const cellRefPattern = /[A-Z]+\d+$/;
      let newValue;
      let newCursorPosition;
      
      if (cellRefPattern.test(beforeCursor)) {
        // Replace the last cell reference before cursor
        const match = beforeCursor.match(cellRefPattern);
        const replaceStart = beforeCursor.lastIndexOf(match[0]);
        newValue = beforeCursor.substring(0, replaceStart) + cellRef + afterCursor;
        newCursorPosition = replaceStart + cellRef.length;
      } else {
        // Insert the cell reference at cursor position
        newValue = beforeCursor + cellRef + afterCursor;
        newCursorPosition = beforeCursor.length + cellRef.length;
      }
      
      console.log('Updating formula from', currentValue, 'to', newValue);
      editor.setValue(newValue);
      
      // Position cursor after the inserted cell reference
      setTimeout(() => {
        if (editor.TEXTAREA) {
          editor.TEXTAREA.focus();
          editor.TEXTAREA.setSelectionRange(newCursorPosition, newCursorPosition);
          console.log('Cursor positioned at', newCursorPosition);
        }
      }, 0);
      
      return false; // Prevent default cell selection
    }
    return true;
  }, [isFormulaMode, formulaEditingCell]);

  // Handle arrow key navigation for copy cell selection
  const handleArrowKeyNavigation = useCallback((event, hotInstance) => {
    if (!isFormulaMode || !formulaEditingCell) return true;

    const editor = hotInstance.getActiveEditor();
    if (!editor || !editor.isOpened()) return true;

    // In formula mode, always allow arrow key navigation if editor is active
    if (!shouldEnableCopyCell(editor)) return true;

    // Check for arrow keys
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
      const cursorPosition = editor.TEXTAREA ? editor.TEXTAREA.selectionStart : currentValue.length;
      
      const beforeCursor = currentValue.substring(0, cursorPosition);
      const afterCursor = currentValue.substring(cursorPosition);
      
      const cellRefPattern = /[A-Z]+\d+$/;
      let newValue;
      let newCursorPosition;
      
      if (cellRefPattern.test(beforeCursor)) {
        const match = beforeCursor.match(cellRefPattern);
        const replaceStart = beforeCursor.lastIndexOf(match[0]);
        newValue = beforeCursor.substring(0, replaceStart) + cellRef + afterCursor;
        newCursorPosition = replaceStart + cellRef.length;
      } else {
        newValue = beforeCursor + cellRef + afterCursor;
        newCursorPosition = beforeCursor.length + cellRef.length;
      }
      
      editor.setValue(newValue);

      setTimeout(() => {
        if (editor.TEXTAREA) {
          editor.TEXTAREA.focus();
          editor.TEXTAREA.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      }, 0);

      return false;
    }

    return true;
  }, [isFormulaMode, formulaEditingCell, copyCellSelection, shouldEnableCopyCell]);

  // PREVENT cell selection when in formula mode - this is the key fix
  const handleBeforeSelection = useCallback((startRow, startCol, endRow, endCol) => {
    if (isFormulaMode && formulaEditingCell) {
      const hotInstance = hotTableComponent.current?.hotInstance;
      const editor = hotInstance?.getActiveEditor();
      
      // If we're editing a formula, prevent changing cell selection
      if (editor && editor.isOpened()) {
        console.log('Preventing cell selection change during formula editing');
        return false; // Prevent selection change
      }
    }
    return true; // Allow normal selection
  }, [isFormulaMode, formulaEditingCell]);

  // Handle key events - detect = key and operators to enter formula mode
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
    
    // Check if we're starting a formula with = key - IMMEDIATELY enter formula mode
    if (event.key === '=' && !isFormulaMode) {
      console.log('= key pressed, entering formula mode immediately');
      enterFormulaMode(row, col);
    }

    // Check if they're typing mathematical operators - FORCE formula mode
    const operators = ['+', '-', '*', '/', '^', '(', ')'];
    if (operators.includes(event.key) && !isFormulaMode) {
      // Check if there's existing content in the cell
      const editor = hotInstance.getActiveEditor();
      if (editor && editor.isOpened()) {
        const currentValue = editor.getValue() || '';
        const cellValue = hotInstance.getDataAtCell(row, col);
        
        // If there's existing content OR they're typing an operator, this is likely a formula
        if (currentValue || cellValue) {
          console.log(`Operator '${event.key}' typed with existing content, forcing formula mode`);
          enterFormulaMode(row, col);
        }
      }
    }

    // Handle ESC key to exit formula mode
    if (event.key === 'Escape' && isFormulaMode) {
      console.log('ESC pressed, exiting formula mode');
      exitFormulaMode();
      return;
    }

    // Handle Tab key to commit and exit formula mode
    if (event.key === 'Tab' && isFormulaMode) {
      console.log('Tab pressed, committing formula and exiting formula mode');
      const editor = hotInstance.getActiveEditor();
      if (editor && editor.isOpened()) {
        editor.finishEditing();
      }
      exitFormulaMode();
      return;
    }

    // Stay in formula mode for all other keys when editing a formula
    if (isFormulaMode && formulaEditingCell) {
      console.log('Key pressed in formula mode:', event.key, '- staying in formula mode');
    }
  }, [isFormulaMode, handleArrowKeyNavigation, formulaEditingCell, enterFormulaMode, exitFormulaMode]);

  // ONLY exit formula mode when cell value is actually committed (Enter pressed)
  const handleAfterChange = useCallback((changes, source) => {
    if (changes && source !== 'loadData') {
      changes.forEach(([row, col, oldValue, newValue]) => {
        console.log(`Cell committed (Enter pressed): row ${row}, col ${col}, value:`, newValue);
        
        // Only exit formula mode when the cell value is actually committed
        if (isFormulaMode && formulaEditingCell && 
            formulaEditingCell.row === row && formulaEditingCell.col === col) {
          console.log('Formula committed with Enter, exiting formula mode');
          exitFormulaMode();
        }
      });
    }
  }, [isFormulaMode, formulaEditingCell, exitFormulaMode]);

  // Enter formula mode for any cell that starts with = OR when user types =
  const handleAfterBeginEditing = useCallback((row, col) => {
    console.log('Begin editing cell:', row, col);
    
    const hotInstance = hotTableComponent.current?.hotInstance;
    if (!hotInstance) return;

    // Get the cell value IMMEDIATELY
    const cellValue = hotInstance.getDataAtCell(row, col);
    console.log('Cell value when editing begins:', cellValue);
    
    // If it's a formula (starts with =), enter formula mode IMMEDIATELY and AGGRESSIVELY
    if (cellValue && cellValue.toString().startsWith('=')) {
      console.log('EXISTING FORMULA DETECTED - FORCING formula mode');
      enterFormulaMode(row, col);
      
      // Also set a series of timeouts to ensure formula mode sticks
      setTimeout(() => {
        if (!isFormulaMode) {
          console.log('Formula mode not active, forcing it again');
          enterFormulaMode(row, col);
        }
      }, 10);
      
      setTimeout(() => {
        if (!isFormulaMode) {
          console.log('Formula mode still not active, forcing it AGAIN');
          enterFormulaMode(row, col);
        }
      }, 50);
      
      setTimeout(() => {
        if (!isFormulaMode) {
          console.log('Final attempt to force formula mode');
          enterFormulaMode(row, col);
        }
      }, 100);
    }
  }, [enterFormulaMode, isFormulaMode]);

  // Monitor editor content changes to detect formulas and maintain formula mode
  const handleAfterEditorOpened = useCallback(() => {
    const hotInstance = hotTableComponent.current?.hotInstance;
    if (!hotInstance) return;

    const editor = hotInstance.getActiveEditor();
    if (!editor || !editor.TEXTAREA) return;

    const selected = hotInstance.getSelected();
    if (!selected || selected.length === 0) return;
    const [row, col] = selected[0];

    // FORCE formula mode based on cell content - this is the key fix
    const forceFormulaMode = () => {
      const cellValue = hotInstance.getDataAtCell(row, col);
      const editorValue = editor.getValue() || '';
      
      console.log('Checking cell for existing formula:', { cellValue, editorValue, row, col });
      
      // If the CELL contains a formula (not just what's currently in editor), FORCE formula mode
      if (cellValue && cellValue.toString().startsWith('=')) {
        console.log('CELL CONTAINS FORMULA - FORCING formula mode regardless of current state');
        if (!isFormulaMode) {
          enterFormulaMode(row, col);
        }
        return true;
      }
      
      // Also check editor content
      if (editorValue.startsWith('=')) {
        console.log('EDITOR CONTAINS FORMULA - entering formula mode');
        if (!isFormulaMode) {
          enterFormulaMode(row, col);
        }
        return true;
      }
      
      return false;
    };

    // Force check immediately and repeatedly
    forceFormulaMode();
    setTimeout(forceFormulaMode, 1);
    setTimeout(forceFormulaMode, 5);
    setTimeout(forceFormulaMode, 10);
    setTimeout(forceFormulaMode, 25);
    setTimeout(forceFormulaMode, 50);
    setTimeout(forceFormulaMode, 100);
    setTimeout(forceFormulaMode, 200);

    // Set up CONTINUOUS monitoring - this ensures we stay in formula mode
    const handleInput = () => {
      const cellValue = hotInstance.getDataAtCell(row, col);
      const currentValue = editor.getValue() || '';
      
      console.log('Input detected:', { cellValue, currentValue });
      
      // If the ORIGINAL cell had a formula OR current content starts with =, stay in formula mode
      const shouldBeInFormulaMode = (cellValue && cellValue.toString().startsWith('=')) || 
                                   currentValue.startsWith('=');
      
      if (shouldBeInFormulaMode && !isFormulaMode) {
        console.log('Should be in formula mode, entering now');
        enterFormulaMode(row, col);
      } else if (!shouldBeInFormulaMode && isFormulaMode && formulaEditingCell) {
        console.log('Should not be in formula mode, exiting');
        exitFormulaMode();
      }
    };

    // Set up multiple event listeners
    const events = ['input', 'keyup', 'paste', 'change', 'focus', 'click'];
    events.forEach(eventType => {
      editor.TEXTAREA.addEventListener(eventType, handleInput);
    });

    // Continuous monitoring interval - checks every 25ms
    const intervalCheck = setInterval(() => {
      if (!editor.isOpened()) {
        clearInterval(intervalCheck);
        return;
      }
      
      const cellValue = hotInstance.getDataAtCell(row, col);
      const currentValue = editor.getValue() || '';
      
      // Force formula mode if cell originally contained formula
      if (cellValue && cellValue.toString().startsWith('=') && !isFormulaMode) {
        console.log('Interval: Cell contains formula, forcing formula mode');
        enterFormulaMode(row, col);
      } else if (currentValue.startsWith('=') && !isFormulaMode) {
        console.log('Interval: Editor contains formula, entering formula mode');
        enterFormulaMode(row, col);
      }
    }, 25);

    // Clean up when editor closes
    const originalFinishEditing = editor.finishEditing.bind(editor);
    editor.finishEditing = function(...args) {
      console.log('Editor finishing, cleaning up');
      clearInterval(intervalCheck);
      if (editor.TEXTAREA) {
        events.forEach(eventType => {
          editor.TEXTAREA.removeEventListener(eventType, handleInput);
        });
      }
      return originalFinishEditing(...args);
    };
  }, [isFormulaMode, formulaEditingCell, enterFormulaMode, exitFormulaMode]);

  // Enhanced cell click handler
  const handleBeforeOnCellMouseDown = useCallback((event, coords, TD) => {
    const hotInstance = hotTableComponent.current?.hotInstance;
    if (!hotInstance) return;

    console.log('Mouse down on cell:', coords, 'Formula mode:', isFormulaMode);

    if (isFormulaMode && formulaEditingCell) {
      const editor = hotInstance.getActiveEditor();
      
      // Only allow clicking for formula building if editor is active
      if (!editor || !editor.isOpened()) {
        console.log('Editor not active, blocking click during formula mode');
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
      }
      
      // Don't allow clicking on the same cell being edited
      if (coords.row === formulaEditingCell.row && coords.col === formulaEditingCell.col) {
        console.log('Clicking on same cell being edited, allowing');
        return true;
      }
      
      console.log('Intercepting click for formula mode');
      
      // Prevent the default cell selection
      event.stopImmediatePropagation();
      event.preventDefault();
      
      // Set copy cell selection
      setCopyCellSelection({ row: coords.row, col: coords.col });
      
      const cellRef = getCellReference(coords.row, coords.col);
      
      const currentValue = editor.getValue() || '';
      const cursorPosition = editor.TEXTAREA ? editor.TEXTAREA.selectionStart : currentValue.length;
      
      const beforeCursor = currentValue.substring(0, cursorPosition);
      const afterCursor = currentValue.substring(cursorPosition);
      
      const cellRefPattern = /[A-Z]+\d+$/;
      let newValue;
      let newCursorPosition;
      
      if (cellRefPattern.test(beforeCursor)) {
        const match = beforeCursor.match(cellRefPattern);
        const replaceStart = beforeCursor.lastIndexOf(match[0]);
        newValue = beforeCursor.substring(0, replaceStart) + cellRef + afterCursor;
        newCursorPosition = replaceStart + cellRef.length;
      } else {
        newValue = beforeCursor + cellRef + afterCursor;
        newCursorPosition = beforeCursor.length + cellRef.length;
      }
      
      console.log('Updating formula via click:', currentValue, '->', newValue);
      editor.setValue(newValue);
      
      setTimeout(() => {
        if (editor.TEXTAREA) {
          editor.TEXTAREA.focus();
          editor.TEXTAREA.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      }, 0);
      
      return false;
    }
  }, [isFormulaMode, formulaEditingCell]);

  // Prevent clicking away from cell during formula mode
  const handleAfterSelection = useCallback((row, col, row2, col2, preventScrolling, selectionLayerLevel) => {
    if (isFormulaMode && formulaEditingCell) {
      const hotInstance = hotTableComponent.current?.hotInstance;
      const editor = hotInstance?.getActiveEditor();
      
      // If we're in formula mode and the selection changed to a different cell, revert it
      if (editor && editor.isOpened() && 
          (row !== formulaEditingCell.row || col !== formulaEditingCell.col)) {
        console.log('Preventing selection change during formula editing, reverting to editing cell');
        
        // Revert selection back to the editing cell
        setTimeout(() => {
          hotInstance.selectCell(formulaEditingCell.row, formulaEditingCell.col, formulaEditingCell.row, formulaEditingCell.col, false);
        }, 0);
      }
    }
  }, [isFormulaMode, formulaEditingCell]);

  // Scroll handling (keeping original implementation)
  const handleWheel = useCallback((e) => {
    const container = spreadsheetContainerRef.current;
    if (!container) return;

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
      
      let hotScrollableElement = container.querySelector('.wtHolder');
      
      if (!hotScrollableElement) {
        hotScrollableElement = container.querySelector('.ht_master .wtHolder');
      }
      if (!hotScrollableElement) {
        hotScrollableElement = container.querySelector('.handsontable .wtHolder');
      }

      if (hotScrollableElement) {
        hotScrollableElement.scrollTop += e.deltaY;
        hotScrollableElement.scrollLeft += e.deltaX;
      } else {
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

  useEffect(() => {
    const container = spreadsheetContainerRef.current;
    if (!container) return;

    let cleanupFunctions = [];

    const setupScrollPrevention = () => {
      const hotInstance = hotTableComponent.current?.hotInstance;
      
      if (!hotInstance) {
        const retryTimeout = setTimeout(setupScrollPrevention, 100);
        cleanupFunctions.push(() => clearTimeout(retryTimeout));
        return;
      }

      container.addEventListener('wheel', handleWheel, { 
        passive: false,
        capture: true
      });

      document.addEventListener('wheel', handleWheel, { 
        passive: false,
        capture: true
      });

      cleanupFunctions.push(() => {
        container.removeEventListener('wheel', handleWheel, { capture: true });
        document.removeEventListener('wheel', handleWheel, { capture: true });
      });

      setTimeout(() => {
        if (hotInstance) {
          hotInstance.render();
        }
      }, 50);
    };

    setupScrollPrevention();

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [handleWheel, data, activeTab]);

  // Clean up editor monitoring on unmount
  useEffect(() => {
    return () => {
      stopEditorMonitoring();
    };
  }, [stopEditorMonitoring]);

  // Column headers and setup (keeping original)
  const colHeaders = [
    'Metric', '2014A', '2015A', '2016A', '2017A', '2018A',
    '2019P', '2020P', '2021P', '2022P'
  ];

  const generateColumnLetters = (count) => {
    const letters = [];
    for (let i = 0; i < count; i++) {
      if (i < 26) {
        letters.push(String.fromCharCode(65 + i));
      } else {
        const firstLetter = String.fromCharCode(64 + Math.floor(i / 26));
        const secondLetter = String.fromCharCode(65 + (i % 26));
        letters.push(firstLetter + secondLetter);
      }
    }
    return letters;
  };

  const columnLetters = generateColumnLetters(colHeaders.length);
  const nestedHeaders = [columnLetters, colHeaders];

  const afterChange = (changes, source) => {
    if (changes && source !== 'loadData') {
      changes.forEach(([row, col]) => {
        console.log(`Cell changed: row ${row}, col ${col}`);
      });
    }
    handleAfterChange(changes, source);
  };

  const afterInit = () => {
    console.log('Handsontable initialized');
    setTimeout(() => {
      const container = spreadsheetContainerRef.current;
      if (container) {
        container.dispatchEvent(new CustomEvent('handsontable-ready'));
      }
    }, 50);
  };

  // Pad data to minimum rows
  const minRows = 20;
  const numCols = colHeaders.length;
  const paddedData = [...data];
  while (paddedData.length < minRows) {
    paddedData.push(new Array(numCols).fill(''));
  }

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
        color: "#000000",
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
        borderTop: '3px solid #1f3a60',
        borderLeft: '3px solid #1f3a60',
        borderBottom: '3px solid #1f3a60',
        borderRight: 'none',
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
        beforeEditor={handleAfterEditorOpened}
        afterBeginEditing={handleAfterBeginEditing}
        beforeOnCellMouseDown={handleBeforeOnCellMouseDown}
        beforeKeyDown={handleKeyDown}
        afterSelection={handleAfterSelection}
        beforeSelection={handleBeforeSelection}
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


          const metricName = data[row]?.[0];


          if (col === 0) {
        // Example: Make it bold if the metric is "Revenue" or "EBITDA"
        if (["Income Statement", "Balance Sheet", "Cash Flow Statement", "Assumptions"].includes(metricName)) {
          classes.push('bold-metric');
        }
      }



          // Zebra striping
          if (row % 2 === 1 && !correctCellsROW.includes(row) && !incorrectCellsROW.includes(row)) {

            classes.push('even-row');
          }

          if (isFormulaMode && formulaEditingCell && 
              formulaEditingCell.row === row && formulaEditingCell.col === col) {
            classes.push('formula-editing');
          }

          if (copyCellSelection && 
              copyCellSelection.row === row && copyCellSelection.col === col) {
            classes.push('copy-cell-selected');
          }

          if (currentStepContent.highlightRows && currentStepContent.highlightRows.tab === activeTab) {
            if (Object.values(currentStepContent.highlightRows.rows).includes(row)) {
              classes.push('quizcel');
            }
          }
          
          if (currentStepContent.Qtype === "cells") {
            for (let i = 0; i <= 200; i++) {
              const quizCel = currentStepContent[`Quizcels_ROW_${i}`];
              if (
                quizCel?.tab === activeTab &&
                i === row &&
                Object.values(quizCel.cols).includes(col)
              ) {
                console.log("passed dinklecheck")
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