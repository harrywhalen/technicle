"use client";
import React, { useState, useRef, useEffect,} from 'react';
import styles from './Sidebar.module.css';
import lessonData from "./data/lessondata.json"; // Import the JSON file

const NAVBAR_HEIGHT = '4.375rem';

// Define the initial conceptual sections
const sidebarSections = [
  {
    title: lessonData['1'].name,
    id: 1, // Matches the key in lessonContentData
  },
  {
    title: lessonData['2'].name,
    id: 2,
  },
  {
    title: lessonData['3'].name,
    id: 3,
  },
  {
    title: lessonData['4'].name,
    id: 4,
  },
  {
    title: lessonData['5'].name,
    id: 5,
  },
    {
    title: lessonData['6'].name,
    id: 6,
  },
    {
    title: lessonData['7'].name,
    id: 7,
  },
      {
    title: lessonData['8'].name,
    id: 8,
  },
        {
    title: lessonData['9'].name,
    id: 9,
  },
          {
    title: lessonData['10'].name,
    id: 10,
  },
        {
    title: lessonData['11'].name,
    id: 11,
  },
          {
    title: lessonData['12'].name,
    id: 12,
  },
        {
    title: lessonData['13'].name,
    id: 13,
  },


];



const Sidebar = ({ onSectionChange,currentActiveStepId, setCurrentActiveStepId, highestStep}) => {
  // Initialize with 'dcf-intro' to match Module's default content.
  // This ensures the correct quiz/textbox content shows up on initial load.





const handleSectionClick = (id) => {
  // id is already a number from sidebarSections
  if (id <= highestStep) {
    setCurrentActiveStepId(id);

    if (onSectionChange) {
      onSectionChange(id); // Notify parent
    }
    console.log("Highest step:", highestStep);
    console.log("Current active step:", currentActiveStepId);
  }
};


  return (
    <aside
      className={styles.sidebar}
      style={{
        top: NAVBAR_HEIGHT,
        height: `calc(100vh - ${NAVBAR_HEIGHT})`,
      }}
    >

      {/* Navigation sections */}
      <nav
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          direction: 'ltr', // For scrollbar on left
          scrollbarWidth: 'thin', // For Firefox
          scrollbarColor: '#3498db #2c3e50', // For Firefox (thumb track)
          '&::WebkitScrollbar': {
            width: 'thin',
          },
          '&::WebkitScrollbarTrack': {
            backgroundColor: '#1f3a60',
            borderRadius: '0.625rem',
          },
          ' &::WebkitScrollbarThumb': {
            backgroundColor: '#1f3a60',
            borderRadius: '0.625rem',
            border: '0.125rem solid #2c3e50',
          },
          '&::WebkitScrollbarThumb:hover': {
            backgroundColor: '#1f3a60',
          },
          '&::WebkitScrollbarButton': {
            display: 'none',
          },
        }}
      >
        <ul
          className={styles.navList}
          style={{
            direction: 'ltr', // Revert content direction
            paddingRight: '0.8vw', // Responsive padding based on viewport
          }}
        >
          {sidebarSections.map((section) => (
            <li key={section.id} className={styles.navItem}>
              <div
                onClick={() => handleSectionClick(section.id)}
                style={{ 
                  cursor: 'pointer', 
                  fontSize: `clamp(1rem, 1vw, 1rem)`, // Responsive font size that scales with sidebar
                  lineHeight: '1.2', // Tighter line height for better fit
                  padding: '0.4vw 0.6vw', // Responsive padding
                  wordBreak: 'break-word', // Allow text to wrap if needed
                  hyphens: 'auto', // Enable hyphenation for better text wrapping
                  textAlign: 'left', // Ensure text alignment
                  whiteSpace: 'normal', // Allow text wrapping
                }}
                className={`${styles.navLink} ${currentActiveStepId === section.id ? styles.active : ''}`}
              >
                {section.title}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;