"use client";
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase'; // Your Firebase config
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function FeedbackPLZ() {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Check rate limit on component mount
  useEffect(() => {
    checkRateLimit();
  }, []);

  const checkRateLimit = () => {
    const today = new Date().toDateString();
    const submissions = JSON.parse(localStorage.getItem('feedbackSubmissions') || '{}');
    const todayCount = submissions[today] || 0;
    
    if (todayCount >= 3) {
      setIsDisabled(true);
    }
  };

  const updateRateLimit = () => {
    const today = new Date().toDateString();
    const submissions = JSON.parse(localStorage.getItem('feedbackSubmissions') || '{}');
    const todayCount = submissions[today] || 0;
    
    submissions[today] = todayCount + 1;
    localStorage.setItem('feedbackSubmissions', JSON.stringify(submissions));
    
    if (submissions[today] >= 3) {
      setIsDisabled(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim() || isDisabled || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Direct Firestore write (works on Spark plan)
      await addDoc(collection(db, 'feedback'), {
        feedback: feedback.trim(),
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        created: new Date().toISOString()
      });

      updateRateLimit();
      setFeedback(''); // Clear the input field
      // Show success state briefly then reset
      setTimeout(() => setIsSubmitting(false), 1000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        padding: '2rem 1rem',
        width: '99.2vw',
        backgroundColor: '#1f3a60',
        color: 'white',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxSizing: 'border-box',
        marginTop: '5vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            marginRight: '1rem',
          }}
        >
          We want your feedback!
        </span>

        <input
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={isDisabled || isSubmitting}
          placeholder={isDisabled ? "Daily limit reached" : "Share your thoughts..."}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
          style={{
            flex: '1 1 250px',
            maxWidth: '300px',
            padding: '0.5rem',
            backgroundColor: isDisabled ? '#2c4a6b' : '#1f3a60',
            border: '1px solid #ffffff',
            color: isDisabled ? '#888' : 'white',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            borderRadius: '0.5rem 0 0 0.5rem',
            cursor: isDisabled ? 'not-allowed' : 'text',
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={isDisabled || isSubmitting || !feedback.trim()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isDisabled || !feedback.trim() ? '#6c7b7f' : isSubmitting ? '#2ecc71' : '#3498db',
            border: '1px solid #ffffff',
            borderRadius: '0 0.5rem 0.5rem 0',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: isDisabled || !feedback.trim() ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          {isSubmitting ? '✓ Sent' : 'Send'}
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          fontSize: '0.875rem',
          fontWeight: 'normal',
        }}
      >
        <span>What do you like and dislike?</span>
        <span>What do you want added or removed?</span>
      </div>
    </div>
  );
}