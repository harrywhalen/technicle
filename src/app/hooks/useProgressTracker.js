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
        }
      } else {
        // Create initial document (this is the only immediate write)
        const initialProgress = { highestStep: 1, currentStep: 1 };
        await setDoc(userDoc, {
          userId: user.uid,
          moduleProgress: {
            [moduleId]: {
              ...initialProgress,
              lastVisited: new Date()
            }
          }
        });
        lastSavedProgressRef.current = initialProgress;
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Internal save function - only writes if there are actual changes
  const saveProgressToFirebase = async (currentStep, highestStep, isImmediate = false) => {
    if (!user?.uid || !moduleId) return;

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
      
      await updateDoc(userDoc, {
        [`moduleProgress.${moduleId}`]: {
          highestStep: Math.max(highestStep, lastSaved.highestStep),
          currentStep: currentStep,
          lastVisited: new Date()
        }
      });

      lastSavedProgressRef.current = {
        currentStep,
        highestStep: Math.max(highestStep, lastSaved.highestStep)
      };

      console.log(`Progress saved to Firebase: Step ${currentStep}, Highest: ${Math.max(highestStep, lastSaved.highestStep)}`);
    } catch (error) {
      console.error('Error saving progress:', error);
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
    if (!user?.uid || !moduleId) return;

    try {
      const userDoc = doc(db, 'userProgress', user.uid);
      
      await updateDoc(userDoc, {
        [`moduleProgress.${moduleId}.completed`]: true,
        [`moduleProgress.${moduleId}.completedAt`]: new Date()
      });
    } catch (error) {
      console.error('Error marking module complete:', error);
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

// Updated ModuleContent integration
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

  if (isLoading) {
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

  // Rest of your component...
}