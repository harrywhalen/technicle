import { useCallback, useRef } from 'react';

export const useSpreadsheetValidator = (hotRef) => {
  const encodedAnswersRef = useRef(null);
  const currentSheetRef = useRef('intro'); // Track current sheet
  
  // Simple encoding to hide from casual inspection
  const encodeAnswers = useCallback((answers) => {
    return btoa(JSON.stringify(answers));
  }, []);
  
  const decodeAnswers = useCallback((encodedAnswers) => {
    try {
      return JSON.parse(atob(encodedAnswers));
    } catch (error) {
      console.error('Failed to decode answers');
      return null;
    }
  }, []);
  
  // Store encoded answers (call this once when you fetch from Firestore)
  const setCorrectAnswers = useCallback((answers) => {
    encodedAnswersRef.current = encodeAnswers(answers);
  }, [encodeAnswers]);
  
  // Set current sheet (call this when switching tabs)
  const setCurrentSheet = useCallback((sheetKey) => {
    currentSheetRef.current = sheetKey;
  }, []);
  
  // Check individual cell (called on each user input)
  const checkCell = useCallback((row, col, sheetKey = null) => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !encodedAnswersRef.current) return;
    
    // Use provided sheetKey or current sheet
    const sheet = sheetKey || currentSheetRef.current;
    
    // Decode only when checking (minimal performance impact)
    const correctAnswers = decodeAnswers(encodedAnswersRef.current);
    if (!correctAnswers) return;
    
    const cellValue = hot.getDataAtCell(row, col);
    const correctValue = correctAnswers[`${sheet}_${row},${col}`];
    
    // Only check if we have a correct answer for this cell
    if (correctValue === undefined) return;
    
    // Clear any existing styling first
    hot.setCellMeta(row, col, 'className', '');
    
    if (cellValue && cellValue.toString().trim() !== '') {
      if (cellValue.toString().trim() === correctValue?.toString().trim()) {
        hot.setCellMeta(row, col, 'className', 'correct-cell');
      } else {
        hot.setCellMeta(row, col, 'className', 'incorrect-cell');
      }
    }
    
    hot.render();
  }, [hotRef, decodeAnswers]);
  
  // Check all test cells for current sheet
  const validateCurrentSheet = useCallback(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !encodedAnswersRef.current) return;
    
    const correctAnswers = decodeAnswers(encodedAnswersRef.current);
    if (!correctAnswers) return;
    
    const currentSheet = currentSheetRef.current;
    let score = 0;
    let total = 0;
    
    // Filter answers for current sheet only
    Object.keys(correctAnswers).forEach(key => {
      if (key.startsWith(`${currentSheet}_`)) {
        const [, coordinates] = key.split('_');
        const [row, col] = coordinates.split(',').map(Number);
        const cellValue = hot.getDataAtCell(row, col);
        const correctValue = correctAnswers[key];
        
        total++;
        if (cellValue?.toString().trim() === correctValue?.toString().trim()) {
          score++;
          hot.setCellMeta(row, col, 'className', 'correct-cell');
        } else {
          hot.setCellMeta(row, col, 'className', 'incorrect-cell');
        }
      }
    });
    
    hot.render();
    return { score, total, percentage: total > 0 ? Math.round((score / total) * 100) : 0 };
  }, [hotRef, decodeAnswers]);
  
  // Check all test cells across all sheets
  const validateAllCells = useCallback(() => {
    const correctAnswers = decodeAnswers(encodedAnswersRef.current);
    if (!correctAnswers) return;
    
    let totalScore = 0;
    let totalQuestions = 0;
    
    // Count all answers across all sheets
    Object.keys(correctAnswers).forEach(key => {
      totalQuestions++;
      // Note: We can't check cells from other sheets since they're not loaded
      // This would need to be called when each sheet is active, or we'd need
      // to store user answers separately
    });
    
    console.log('Total questions across all sheets:', totalQuestions);
    
    // For now, just validate current sheet
    return validateCurrentSheet();
  }, [decodeAnswers, validateCurrentSheet]);
  
  // Get current score for current sheet only
  const getScore = useCallback(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !encodedAnswersRef.current) return null;
    
    const correctAnswers = decodeAnswers(encodedAnswersRef.current);
    if (!correctAnswers) return null;
    
    const currentSheet = currentSheetRef.current;
    let score = 0;
    let total = 0;
    
    // Filter answers for current sheet only
    Object.keys(correctAnswers).forEach(key => {
      if (key.startsWith(`${currentSheet}_`)) {
        const [, coordinates] = key.split('_');
        const [row, col] = coordinates.split(',').map(Number);
        const cellValue = hot.getDataAtCell(row, col);
        const correctValue = correctAnswers[key];
        
        total++;
        if (cellValue?.toString().trim() === correctValue?.toString().trim()) {
          score++;
        }
      }
    });
    
    return { score, total, percentage: total > 0 ? Math.round((score / total) * 100) : 0 };
  }, [hotRef, decodeAnswers]);
  
  return { 
    checkCell, 
    validateAllCells,
    validateCurrentSheet, // New: validate only current sheet
    setCorrectAnswers, 
    setCurrentSheet, // New: set current sheet
    getScore 
  };
};