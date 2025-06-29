"use client";
  import React, { useState } from 'react';
  import styles from './Sidebar.module.css';



  export default function Sidebar({ onSectionChange, currentActiveStepId, currentStepContent }) {

  const NAVBAR_HEIGHT = '70px';

  const baseSidebarSections = [
    {
      title: 'What is a DCF?',
      id: 'dcf-intro',
    },
    {
      title: 'Key Metrics',
      id: 'key-metrics',
    },
    {
      title: 'Forecasting',
      id: 'forecasting',
    },
    {
      title: 'Terminal Value',
      id: 'terminal-value',
    },
    {
      title: 'Final Valuation',
      id: 'final-valuation',
    },
  ];

  const generatedSidebarSteps = [];
  for (let i = 1; i <= 30; i++) {
    generatedSidebarSteps.push({
      title: `Step ${i}`,
      id: `step-${i}`,
    });
  }

  const sidebarSections = [...baseSidebarSections, ...generatedSidebarSteps];

  const [activeSectionId, setActiveSectionId] = useState('dcf-intro');

  const handleSectionClick = (id) => {
    setActiveSectionId(id);
    if (onSectionChange) {
      onSectionChange(id);
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
      <nav
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          direction: 'ltr',
          scrollbarWidth: 'thin',
          scrollbarColor: '#3498db #2c3e50',
        }}
      >
        <ul
          className={styles.navList}
          style={{
            direction: 'ltr',
            paddingLeft: '0px',
            paddingRight: '20px',
          }}
        >
          {sidebarSections.map((section) => (
            <li key={section.id} className={styles.navItem}>
              <div
                onClick={() => handleSectionClick(section.id)}
                style={{ cursor: 'pointer' }}
                className={`${styles.navLink} ${activeSectionId === section.id ? styles.active : ''}`}
              >
                {section.title}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
