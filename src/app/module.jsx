"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from "./sidebar.jsx";
import LessonName from "./lessonName.jsx";
import Big3 from "./big3.jsx";
import lessonData from "./data/lessondata.json"; // Import the JSON file

export default function Module() {
    const [currentActiveStepId, setCurrentActiveStepId] = useState('dcf-intro');
    const [currentStepContent, setCurrentStepContent] = useState(lessonData[currentActiveStepId]);

    useEffect(() => {
        const newContent = lessonData[currentActiveStepId];
        if (newContent) {
            setCurrentStepContent(newContent);
        } else {
            console.warn(`Content not found for step ID: ${currentActiveStepId}`);
            setCurrentStepContent(null);
        }
    }, [currentActiveStepId]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row' }}>
            <Sidebar onSectionChange={setCurrentActiveStepId} />
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <LessonName />
                {currentStepContent ? (
                    <Big3 currentStepContent={currentStepContent} />
                ) : (
                    <p style={{ color: '#1f3a60', textAlign: 'center', marginTop: '50px' }}>
                        Loading lesson content...
                    </p>
                )}
            </div>
        </div>
    );
}