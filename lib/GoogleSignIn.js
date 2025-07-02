
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";
import { useEffect, useState } from "react";

const GoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          await handleUserData(result.user);
        }
      } catch (error) {
        console.error("Redirect sign-in error:", error);
      }
    };

    handleRedirectResult();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleUserData = async (user) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // If user doesn't exist, create new user document
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          isNewUser: true
        });
        console.log("New user created");
      } else {
        // Update last login for existing user
        await setDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          isNewUser: false
        }, { merge: true });
        console.log("Existing user signed in");
      }
    } catch (error) {
      console.error("Error handling user data:", error);
    }
  };

  const signInWithGooglePopup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleUserData(result.user);
      console.log("User signed in:", result.user);
    } catch (error) {
      console.error("Sign-in error:", error);
      // Handle specific error codes
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Sign-in cancelled by user");
      } else if (error.code === 'auth/popup-blocked') {
        console.log("Popup blocked, trying redirect...");
        signInWithGoogleRedirect();
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogleRedirect = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Redirect sign-in error:", error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      console.log("User signed out");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  if (user) {
    return (
      <div className="text-center">
        <div className="mb-4">
          <img 
            src={user.photoURL} 
            alt="Profile" 
            className="w-16 h-16 rounded-full mx-auto mb-2"
          />
          <h3 className="text-lg font-semibold">{user.displayName}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <button
          onClick={signOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={signInWithGooglePopup}
        disabled={loading}
        className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 mr-2"></div>
        ) : (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {loading ? "Signing in..." : "Continue with Google"}
      </button>
      
      {/* Fallback for mobile or if popup fails */}
      <button
        onClick={signInWithGoogleRedirect}
        className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Having trouble? Try redirect sign-in
      </button>
    </div>
  );
};

export default GoogleSignIn;