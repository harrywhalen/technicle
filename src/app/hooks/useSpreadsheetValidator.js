import { useCallback } from 'react';

export const useSpreadsheetValidator = (hotRef, correctAnswers) => {
  const checkCell = useCallback((row, col) => {
    const hot = hotRef.current?.hotInstance;
    const cellValue = hot?.getDataAtCell(row, col);
    const correctValue = correctAnswers[`${row},${col}`];
    const cell = hot?.getCell(row, col);
    
    if (!cell) return;
    
    if (cellValue === correctValue) {
      cell.style.border = '2px solid green';
    } else if (cellValue) {
      cell.style.border = '2px solid red';
    } else {
      cell.style.border = '';
    }
  }, [hotRef, correctAnswers]);

  return checkCell;
};