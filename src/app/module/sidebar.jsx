"use client";
import React, { useState, useRef, useEffect, useMemo} from 'react';
import styles from './Sidebar.module.css';

const NAVBAR_HEIGHT = '10vh';

const Sidebar = ({ onSectionChange,currentActiveStepId, setCurrentActiveStepId, highestStep, modContent}) => {
  // Initialize with 'dcf-intro' to match Module's default content.
  // This ensures the correct quiz/textbox content shows up on initial load.


const sidebarSections = useMemo(() => {
  if (!modContent) return []; // Return an empty array if modContent isn't ready
  return Object.entries(modContent).map(([key, lesson]) => ({
    title: lesson.name,
    id: parseInt(key),
  }));
}, [modContent]);


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
            paddingRight: '1.25rem', // Space between content and scrollbar
          }}
        >
          {sidebarSections.map((section) => (
            <li key={section.id} className={styles.navItem}>
              <div
                onClick={() => handleSectionClick(section.id)}
                style={{ cursor: 'pointer', fontSize: '1.05vw' }}
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