// hooks/useProgressTracker.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.js';
import { useAuth } from '../context/AuthContext';

export const useProgressTracker = (moduleId) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({
    highestStep: 1,
    currentStep: 1
  });

  // Track local changes that haven't been saved yet
  const pendingChangesRef = useRef(null);
  const lastSavedProgressRef = useRef({ highestStep: 1, currentStep: 1 });
  const saveTimeoutRef = useRef(null);

  // Load progress ONCE when component mounts
  useEffect(() => {
    if (user?.uid && moduleId) {
      loadUserProgress();
    } else {
      // If no user or moduleId, still allow the component to load with default progress
      setIsLoading(false);
    }
  }, [user?.uid, moduleId]);

  const loadUserProgress = async () => {
    try {
      setIsLoading(true);
      const userDoc = doc(db, 'userProgress', user.uid);
      const docSnap = await getDoc(userDoc);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const moduleProgress = data.moduleProgress?.[moduleId];
        
        if (moduleProgress) {
          const progress = {
            highestStep: moduleProgress.highestStep || 1,
            currentStep: moduleProgress.currentStep || 1
          };
          setUserProgress(progress);
          lastSavedProgressRef.current = progress;
        } else {
          // Module exists in user doc but no progress for this specific module
          console.log('No progress found for this module, starting fresh');
          const defaultProgress = { highestStep: 1, currentStep: 1 };
          setUserProgress(defaultProgress);
          lastSavedProgressRef.current = defaultProgress;
        }
      } else {
        // No user document exists - set defaults and let the app work
        console.log('No user progress document found, starting fresh');
        const defaultProgress = { highestStep: 1, currentStep: 1 };
        setUserProgress(defaultProgress);
        lastSavedProgressRef.current = defaultProgress;
        
        // Try to create initial document, but don't block the UI if it fails
        try {
          await setDoc(userDoc, {
            userId: user.uid,
            moduleProgress: {
              [moduleId]: {
                ...defaultProgress,
                lastVisited: new Date()
              }
            }
          });
          console.log('Created initial progress document');
        } catch (createError) {
          console.error('Failed to create initial progress document, but continuing:', createError);
          // Don't throw - allow the app to continue with local state
        }
      }
    } catch (error) {
      console.error('Error loading progress, using defaults:', error);
      // Always fall back to defaults if anything goes wrong
      const defaultProgress = { highestStep: 1, currentStep: 1 };
      setUserProgress(defaultProgress);
      lastSavedProgressRef.current = defaultProgress;
    } finally {
      // ALWAYS set loading to false, regardless of what happened above
      setIsLoading(false);
    }
  };

  // Internal save function - only writes if there are actual changes
  const saveProgressToFirebase = async (currentStep, highestStep, isImmediate = false) => {
    if (!user?.uid || !moduleId) {
      console.log('No user or moduleId, skipping save');
      return;
    }

    const newProgress = { currentStep, highestStep };
    const lastSaved = lastSavedProgressRef.current;

    // Skip if no changes
    if (newProgress.currentStep === lastSaved.currentStep && 
        newProgress.highestStep === lastSaved.highestStep) {
      console.log('No changes to save, skipping Firebase write');
      return;
    }

    try {
      const userDoc = doc(db, 'userProgress', user.uid);
      
      // Check if document exists before trying to update
      const docSnap = await getDoc(userDoc);
      
      if (docSnap.exists()) {
        // Document exists, update it
        await updateDoc(userDoc, {
          [`moduleProgress.${moduleId}`]: {
            highestStep: Math.max(highestStep, lastSaved.highestStep),
            currentStep: currentStep,
            lastVisited: new Date()
          }
        });
      } else {
        // Document doesn't exist, create it
        await setDoc(userDoc, {
          userId: user.uid,
          moduleProgress: {
            [moduleId]: {
              highestStep: Math.max(highestStep, lastSaved.highestStep),
              currentStep: currentStep,
              lastVisited: new Date()
            }
          }
        });
      }

      lastSavedProgressRef.current = {
        currentStep,
        highestStep: Math.max(highestStep, lastSaved.highestStep)
      };

      console.log(`Progress saved to Firebase: Step ${currentStep}, Highest: ${Math.max(highestStep, lastSaved.highestStep)}`);
    } catch (error) {
      console.error('Error saving progress (non-blocking):', error);
      // Don't throw - allow the app to continue with local progress
    }
  };

  // Update local progress (no Firebase write)
  const updateLocalProgress = useCallback((currentStep, highestStep) => {
    setUserProgress(prev => ({
      currentStep,
      highestStep: Math.max(highestStep, prev.highestStep)
    }));

    // Store pending changes
    pendingChangesRef.current = {
      currentStep,
      highestStep: Math.max(highestStep, userProgress.highestStep)
    };

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set a delayed save (fallback in case user doesn't trigger beforeunload)
    saveTimeoutRef.current = setTimeout(() => {
      if (pendingChangesRef.current) {
        console.log('Auto-saving after 30 seconds of inactivity');
        saveProgressToFirebase(
          pendingChangesRef.current.currentStep, 
          pendingChangesRef.current.highestStep
        );
        pendingChangesRef.current = null;
      }
    }, 30000); // Save after 30 seconds of inactivity
  }, [userProgress.highestStep]);

  // Save immediately (for critical moments)
  const saveProgressImmediately = useCallback(async (currentStep, highestStep) => {
    await saveProgressToFirebase(currentStep, highestStep, true);
    pendingChangesRef.current = null;
  }, []);

  // Save pending changes when user leaves
  const savePendingChanges = useCallback(async () => {
    if (pendingChangesRef.current) {
      console.log('Saving pending changes before exit');
      await saveProgressToFirebase(
        pendingChangesRef.current.currentStep,
        pendingChangesRef.current.highestStep
      );
      pendingChangesRef.current = null;
    }
  }, []);

  // Module completion handler
  const markModuleComplete = async () => {
    if (!user?.uid || !moduleId) {
      console.log('No user or moduleId, skipping module completion');
      return;
    }

    try {
      const userDoc = doc(db, 'userProgress', user.uid);
      
      // Check if document exists first
      const docSnap = await getDoc(userDoc);
      
      if (docSnap.exists()) {
        await updateDoc(userDoc, {
          [`moduleProgress.${moduleId}.completed`]: true,
          [`moduleProgress.${moduleId}.completedAt`]: new Date()
        });
      } else {
        // Create document with completion status
        await setDoc(userDoc, {
          userId: user.uid,
          moduleProgress: {
            [moduleId]: {
              highestStep: userProgress.highestStep,
              currentStep: userProgress.currentStep,
              completed: true,
              completedAt: new Date(),
              lastVisited: new Date()
            }
          }
        });
      }
      
      console.log('Module marked as complete');
    } catch (error) {
      console.error('Error marking module complete (non-blocking):', error);
      // Don't throw - the user has still completed the module locally
    }
  };

  // Setup beforeunload listener
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Use sendBeacon for more reliable saving on page unload
      if (pendingChangesRef.current && navigator.sendBeacon) {
        // Note: sendBeacon is for analytics, for Firestore we need a different approach
        // We'll use the synchronous approach in the cleanup
        savePendingChanges();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && pendingChangesRef.current) {
        // Page is being hidden, save changes
        savePendingChanges();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Save any pending changes when component unmounts
      if (pendingChangesRef.current) {
        saveProgressToFirebase(
          pendingChangesRef.current.currentStep,
          pendingChangesRef.current.highestStep
        );
      }
      
      // Clear timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [savePendingChanges]);

  return {
    userProgress,
    updateLocalProgress,      // Use this for regular step changes
    saveProgressImmediately,  // Use this for critical saves (module completion, etc.)
    markModuleComplete,
    isLoading,
    hasPendingChanges: !!pendingChangesRef.current
  };
};

// Updated ModuleContent integration with better error handling
function ModuleContent({setModDone}) {
  const searchParams = useSearchParams();
  const moduleId = parseInt(searchParams.get("moduleId"));
  const { 
    userProgress, 
    updateLocalProgress, 
    saveProgressImmediately,
    markModuleComplete, 
    isLoading 
  } = useProgressTracker(moduleId);
  
  const [currentActiveStepId, setCurrentActiveStepId] = useState(1);
  const highestStepIdRef = useRef(1);

  // Initialize with saved progress
  useEffect(() => {
    if (!isLoading && userProgress) {
      setCurrentActiveStepId(userProgress.currentStep);
      highestStepIdRef.current = userProgress.highestStep;
    }
  }, [isLoading, userProgress]);

  // Update local progress when step changes (NO Firebase write)
  useEffect(() => {
    if (!isLoading && currentActiveStepId > 0) {
      updateLocalProgress(currentActiveStepId, highestStepIdRef.current);
    }
  }, [currentActiveStepId, isLoading, updateLocalProgress]);

  const advanceStep = () => {
    clearCORCellsArrays();
    clearINCCellsArrays();
    setPreAnswer(true);
    setUpdateME((prev => prev + 1));
    
    setCurrentActiveStepId((prevId) => {
      const nextStep = prevId + 1;
      setNextReady(false);
      
      if (modContent[nextStep.toString()]) {
        if (nextStep > highestStepIdRef.current) {
          highestStepIdRef.current = nextStep;
        }
        return nextStep;
      } else {
        // Module completed - save immediately
        playComplete();
        saveProgressImmediately(prevId, highestStepIdRef.current).then(() => {
          markModuleComplete();
        });
        setModDone(true);
        return prevId;
      }
    });
  };

  // Optional: Add a manual save button for user peace of mind
  const handleManualSave = () => {
    saveProgressImmediately(currentActiveStepId, highestStepIdRef.current);
  };

  // Show loading state but with a timeout fallback
  const [showLoadingFallback, setShowLoadingFallback] = useState(false);
  
  useEffect(() => {
    if (isLoading) {
      // If still loading after 5 seconds, show fallback
      const fallbackTimer = setTimeout(() => {
        setShowLoadingFallback(true);
      }, 5000);
      
      return () => clearTimeout(fallbackTimer);
    }
  }, [isLoading]);

  if (isLoading && !showLoadingFallback) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#1f3a60'
      }}>
        <p>Loading your progress...</p>
      </div>
    );
  }

  if (isLoading && showLoadingFallback) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#1f3a60',
        textAlign: 'center'
      }}>
        <p>Having trouble loading your progress...</p>
        <button 
          onClick={() => {
            setIsLoading(false);
            // Start fresh with default progress
            setCurrentActiveStepId(1);
            highestStepIdRef.current = 1;
          }}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#1f3a60',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Start Fresh
        </button>
      </div>
    );
  }

  // Rest of your component...
}