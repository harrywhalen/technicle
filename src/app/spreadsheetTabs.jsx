"use client";
import React, { useState } from 'react';

// Define the tabs for the spreadsheet interface
const spreadsheetTabs = [
  {
    name: 'Intro',
    id: 'intro', // Unique identifier for the tab
  },
  {
    name: 'Inputs',
    id: 'inputs',
  },
  {
    name: 'Projections',
    id: 'projections',
  },
  {
    name: 'Valuations',
    id: 'valuations',
  },
  {
    name: 'Sensitivity',
    id: 'sensitivity',
  },
];

export default function SpreadsheetTabs({ initialActiveTab = 'intro', onTabChange }) {
  // Manage the active tab state internally, or receive it as a prop
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId); // Call a callback if provided by parent
    }
  };

  return (
    <div
      style={{
        //height: '100px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center', // Align tabs to the left
        alignItems: 'center',
        backgroundColor: '#1f3a60', // Light grey background for the tab bar area
        padding: '10px 20px', // Padding around the tabs

        borderRadius: '8px 8px 0 0', // Rounded top corners
        // Ensure this takes the full width of its parent container
        width: '100%',
        boxSizing: 'border-box', // Include padding in width
      }}
    >
      {spreadsheetTabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          style={{
            width: '140px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeTab === tab.id ? 'bold' : 'normal',
            color: activeTab === tab.id ? '#ffffff' : '#ffffff', // Darker text for active, grey for inactive
            backgroundColor: activeTab === tab.id ? '#3498db' : 'transparent', // White background for active tab
            border: '1px solid #dcdcdc',
            borderBottom: activeTab === tab.id ? '1px solid #ffffff' : '1px solid #dcdcdc', // Hide bottom border for active
            borderRadius: '5px 5px 0 0', // Rounded top corners for individual tabs
            marginRight: '10px', // Small space between tabs
            transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
            position: 'relative', // Needed for border-bottom adjustment
            top: activeTab === tab.id ? '1px' : '0', // Slight push down for active tab visually
          }}
          // Optional hover effects
          onMouseEnter={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.backgroundColor = '#e6e6e6'; // Lighter grey on hover
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {tab.name}
        </div>
      ))}
    </div>
  );
}
