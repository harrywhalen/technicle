"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signInWithPopup, signInWithRedirect, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from '../../lib/firebase';
import googleLogo from './googleLogo.png';

export default function EntryBoxes({top}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUserData = async (user) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email,
          photoURL: user.photoURL || null,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          isNewUser: true
        });
        console.log("New user created");
      } else {
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

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      if (top === 'Sign Up') {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      
      await handleUserData(result.user);
      console.log("User authenticated:", result.user);
      
      // Redirect to main page after successful authentication
      router.push('/moduleSelector');
    } catch (error) {
      console.error("Email auth error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleUserData(result.user);
      console.log("Google sign-in successful:", result.user);
      
      // Redirect to main page after successful authentication
      router.push('/moduleSelector');
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        console.log("Popup blocked, trying redirect...");
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          setError('Sign-in failed. Please try again.');
        }
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '25px',
      }}
    >
      <div
        style={{
          height: '1px',
          width: '540px',
          backgroundColor: '#1f3a60',
          marginBottom: '25px',
        }}
      />

      {error && (
        <div
          style={{
            width: '500px',
            padding: '10px',
            backgroundColor: '#fee',
            border: '1px solid #f88',
            borderRadius: '5px',
            color: '#c33',
            textAlign: 'center',
            marginBottom: '15px',
            fontSize: '14px'
          }}
        >
          {error}
        </div>
      )}

      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          height: '70px',
          width: '500px',
          backgroundColor: '#ffffff',
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor: "#1f3a60",
          display: 'flex',
          alignItems: 'center',
          color: '#1f3a60',
          padding: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '25px',
          fontSize: '16px'
        }}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          height: '70px',
          width: '500px',
          backgroundColor: '#ffffff',
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor: "#1f3a60",
          display: 'flex',
          alignItems: 'center',
          color: '#1f3a60',
          padding: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '25px',
          fontSize: '16px'
        }}
      />

      <div
        style={{
          height: '1px',
          width: '540px',
          backgroundColor: '#1f3a60',
          marginBottom: '25px',
        }}
      />

      <button
        onClick={handleEmailAuth}
        disabled={loading}
        style={{
          height: '70px',
          width: '500px',
          backgroundColor: loading ? '#87ceeb' : '#00bfff',
          borderRadius: '10px',
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '1.5em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '25px',
          cursor: loading ? 'not-allowed' : 'pointer',
          border: 'none'
        }}
      >
        {loading ? 'Processing...' : top}
      </button>

      <button
        onClick={signInWithGoogle}
        disabled={googleLoading}
        style={{
          height: '70px',
          width: '500px',
          backgroundColor: googleLoading ? '#f5f5f5' : '#ffffff',
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor: "#1f3a60",
          borderRadius: '10px',
          color: '#1f3a60',
          fontWeight: 'bold',
          fontSize: '1.5em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          cursor: googleLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {googleLoading ? (
          <>
            <div 
              style={{
                width: '20px',
                height: '20px',
                border: '2px solid #1f3a60',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '15px'
              }}
            />
            Signing in...
          </>
        ) : (
          <>
            <Image 
              src={googleLogo} 
              alt="Google logo" 
              style={{ 
                height: '28px',  
                width: '28px', 
                marginRight: '20px'
              }} 
            />
            Sign In With Google
          </>
        )}
      </button>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}