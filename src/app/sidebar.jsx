"use client";
import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import lessonData from "./data/lessondata.json"; // Import the JSON file

const NAVBAR_HEIGHT = '70px';

// Define the initial conceptual sections
const sidebarSections = [
  {
    title: lessonData['1'].name,
    id: '1', // Matches the key in lessonContentData
  },
  {
    title: lessonData['2'].name,
    id: '2',
  },
  {
    title: lessonData['3'].name,
    id: '3',
  },
  {
    title: lessonData['4'].name,
    id: '4',
  },
  {
    title: lessonData['5'].name,
    id: '5',
  },
];



const Sidebar = ({ onSectionChange,currentActiveStepId, setCurrentActiveStepId }) => {
  // Initialize with 'dcf-intro' to match Module's default content.
  // This ensures the correct quiz/textbox content shows up on initial load.


  const handleSectionClick = (id) => {
    setCurrentActiveStepId(id);
    if (onSectionChange) {
      onSectionChange(id); // Inform the parent (Module) about the new active section
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
            width: '8px',
          },
          '&::WebkitScrollbarTrack': {
            backgroundColor: '#1f3a60',
            borderRadius: '10px',
          },
          ' &::WebkitScrollbarThumb': {
            backgroundColor: '#1f3a60',
            borderRadius: '10px',
            border: '2px solid #2c3e50',
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
            paddingLeft: '0px',
            paddingRight: '20px', // Space between content and scrollbar
          }}
        >
          {sidebarSections.map((section) => (
            <li key={section.id} className={styles.navItem}>
              <div
                onClick={() => handleSectionClick(section.id)}
                style={{ cursor: 'pointer' }}
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