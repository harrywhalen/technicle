import { useCallback, useRef } from 'react';

export const useSpreadsheetValidator = (hotRef) => {
  const encodedAnswersRef = useRef(null);
  const currentSheetRef = useRef('intro'); // Track current sheet
  const correctCellsRef = useRef([]);
  const incorrectCellsROWRef = useRef([]);
  const incorrectCellsCOLRef = useRef([]);
  const correctCellsROWRef = useRef([]);
  const correctCellsCOLRef = useRef([]);

    const clearCORCellsArrays = () => {
    console.log('clearing correctCellsROWRef.current', correctCellsROWRef.current)
    correctCellsROWRef.current = [];
    correctCellsCOLRef.current = [];
  };

    const clearINCCellsArrays = () => {
    console.log('clearing incorrectCellsROWRef.current', incorrectCellsROWRef.current)
    incorrectCellsROWRef.current = [];
    incorrectCellsCOLRef.current = [];
  };

  // Helper: Allow ±5% difference for numeric values
  const isApproximatelyEqual = (a, b, percentageTolerance = 0.025) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (!isNaN(numA) && !isNaN(numB)) {
      const allowedDifference = Math.abs(numB * percentageTolerance);
      return Math.abs(numA - numB) <= allowedDifference;
    }

    // Fallback to string comparison
    return a?.toString().trim() === b?.toString().trim();
  };

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

    const correctCells = [];
    const incorrectCells = [];

  // Check individual cell (called on each user input)
  const checkCell = useCallback((row, col, sheetKey = null) => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !encodedAnswersRef.current) return;

    const sheet = sheetKey || currentSheetRef.current;
    const correctAnswers = decodeAnswers(encodedAnswersRef.current);
    if (!correctAnswers) return;

    const cellValue = hot.getDataAtCell(row, col);
    const correctValue = correctAnswers[`${sheet}_${row},${col}`];

    if (correctValue === undefined) return;



    hot.setCellMeta(row, col, 'className', '');

    if (cellValue && cellValue.toString().trim() !== '') {
      if (isApproximatelyEqual(cellValue, correctValue)) {
        hot.setCellMeta(row, col, 'className', 'correct-cell');
          correctCellsROWRef.current.push(row);
          correctCellsCOLRef.current.push(col);
          console.log('setting correctCellsCOLRef.current', correctCellsCOLRef.current)

      } else {
        hot.setCellMeta(row, col, 'className', 'incorrect-cell');
          incorrectCellsROWRef.current.push(row);
          incorrectCellsCOLRef.current.push(col);

      }
    }

    hot.render();
    return { correctCells, incorrectCells };
  }, [hotRef, decodeAnswers]);
  

  // Validate all test cells for current sheet
  const validateCurrentSheet = useCallback(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !encodedAnswersRef.current) return;
    const correctAnswers = decodeAnswers(encodedAnswersRef.current);
    if (!correctAnswers) return;


    const currentSheet = currentSheetRef.current;
    let score = 0;
    let total = 0;

    Object.keys(correctAnswers).forEach(key => {
      if (key.startsWith(`${currentSheet}_`)) {
        const [, coordinates] = key.split('_');
        const [row, col] = coordinates.split(',').map(Number);
        const cellValue = hot.getDataAtCell(row, col);
        const correctValue = correctAnswers[key];

        total++;
        if (isApproximatelyEqual(cellValue, correctValue)) {
          score++;
          hot.setCellMeta(row, col, 'className', 'correct-cell');
          correctCellsROWRef.current.push(row);
          correctCellsCOLRef.current.push(col);
          console.log('setting correctCellsCOLRef.current', correctCellsCOLRef.current)
        } else {
          hot.setCellMeta(row, col, 'className', 'incorrect-cell');
          incorrectCellsROWRef.current.push(row);
          incorrectCellsCOLRef.current.push(col);
        }
      }
    });

    hot.render();
        console.log("Correct cells:", getCorrectCells());
    console.log("Incorrect rows:", getIncorrectCellsROW());
    return {
      score,
      total,
      percentage: total > 0 ? Math.round((score / total) * 100) : 0
    };
  }, [hotRef, decodeAnswers]);

  // Validate all cells in a given sheet
  const validateAllCells = useCallback((sheetKey = null) => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !encodedAnswersRef.current) return null;

    const correctAnswers = decodeAnswers(encodedAnswersRef.current);
    if (!correctAnswers) return;

    const targetSheet = sheetKey || currentSheetRef.current;
    let score = 0;
    let total = 0;

    Object.keys(correctAnswers).forEach(key => {
      if (key.startsWith(`${targetSheet}_`)) {
        const [, coordinates] = key.split('_');
        const [row, col] = coordinates.split(',').map(Number);
        const cellValue = hot.getDataAtCell(row, col);
        const correctValue = correctAnswers[key];

        total++;
        if (isApproximatelyEqual(cellValue, correctValue)) {
          score++;
          hot.setCellMeta(row, col, 'className', 'correct-cell');
          correctCellsROWRef.current.push(row);
          correctCellsCOLRef.current.push(col);
          console.log('setting correctCellsCOLRef.current', correctCellsCOLRef.current)

        } else {
          hot.setCellMeta(row, col, 'className', 'incorrect-cell');
          incorrectCellsROWRef.current.push(row);
          incorrectCellsCOLRef.current.push(col);
        }
      }
    });

    hot.render();
    return {
      score,
      total,
      percentage: total > 0 ? Math.round((score / total) * 100) : 0
    };
  }, [hotRef, decodeAnswers]);

  // Get score only, without rendering changes
  const getScore = useCallback(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !encodedAnswersRef.current) return null;

    const correctAnswers = decodeAnswers(encodedAnswersRef.current);
    if (!correctAnswers) return null;

    const currentSheet = currentSheetRef.current;
    let score = 0;
    let total = 0;

    Object.keys(correctAnswers).forEach(key => {
      if (key.startsWith(`${currentSheet}_`)) {
        const [, coordinates] = key.split('_');
        const [row, col] = coordinates.split(',').map(Number);
        const cellValue = hot.getDataAtCell(row, col);
        const correctValue = correctAnswers[key];

        total++;
        if (isApproximatelyEqual(cellValue, correctValue)) {
          score++;
        }
      }
    });

    return {
      score,
      total,
      percentage: total > 0 ? Math.round((score / total) * 100) : 0
    };
  }, [hotRef, decodeAnswers]);

  const DEBUG_GOONER= () => [1, 2, 5, 8];
  const getCorrectCellsROW = () => correctCellsROWRef.current;
  const getCorrectCellsCOL = () => correctCellsCOLRef.current;
  const getIncorrectCellsROW = () => incorrectCellsROWRef.current;
  const getIncorrectCellsCOL = () => incorrectCellsCOLRef.current;

  return {
    checkCell,
    validateAllCells,
    validateCurrentSheet,
    setCorrectAnswers,
    setCurrentSheet,
    getScore,
    getCorrectCellsROW,
    getCorrectCellsCOL,
    getIncorrectCellsROW,
    getIncorrectCellsCOL,
    DEBUG_GOONER,
    clearINCCellsArrays,
    clearCORCellsArrays,
  };
};
