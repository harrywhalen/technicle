import { useCallback, useRef } from 'react';

export const useSpreadsheetValidator = (hotRef) => {
  const encodedAnswersRef = useRef(null);
  
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
  
  // Check individual cell (called on each user input)
  const checkCell = useCallback((row, col) => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !encodedAnswersRef.current) return;
    
    // Decode only when checking (minimal performance impact)
    const correctAnswers = decodeAnswers(encodedAnswersRef.current);
    if (!correctAnswers) return;
    
    const cellValue = hot.getDataAtCell(row, col);
    const correctValue = correctAnswers[`${row},${col}`];
    
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
  
  // Check all test cells at once (for final validation)
  const validateAllCells = useCallback(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !encodedAnswersRef.current) return;
    
    const correctAnswers = decodeAnswers(encodedAnswersRef.current);
    if (!correctAnswers) return;
    
    let score = 0;
    let total = 0;
    
    Object.keys(correctAnswers).forEach(key => {
      const [row, col] = key.split(',').map(Number);
      const cellValue = hot.getDataAtCell(row, col);
      const correctValue = correctAnswers[key];
      
      total++;
      if (cellValue?.toString().trim() === correctValue?.toString().trim()) {
        score++;
        hot.setCellMeta(row, col, 'className', 'correct-cell');
      } else {
        hot.setCellMeta(row, col, 'className', 'incorrect-cell');
      }
    });
    
    hot.render();
    // Just return the data, don't show alert
    return { score, total, percentage: Math.round((score / total) * 100) };
  }, [hotRef, decodeAnswers]);
  
  // Get current score without changing cell styling
  const getScore = useCallback(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !encodedAnswersRef.current) return null;
    
    const correctAnswers = decodeAnswers(encodedAnswersRef.current);
    if (!correctAnswers) return null;
    
    let score = 0;
    let total = 0;
    
    Object.keys(correctAnswers).forEach(key => {
      const [row, col] = key.split(',').map(Number);
      const cellValue = hot.getDataAtCell(row, col);
      const correctValue = correctAnswers[key];
      
      total++;
      if (cellValue?.toString().trim() === correctValue?.toString().trim()) {
        score++;
      }
    });
    
    return { score, total, percentage: Math.round((score / total) * 100) };
  }, [hotRef, decodeAnswers]);
  
  return { 
    checkCell, 
    validateAllCells, 
    setCorrectAnswers, 
    getScore 
  };
};