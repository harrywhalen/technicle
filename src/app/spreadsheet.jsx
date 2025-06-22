"use client"; // This directive is necessary for client-side components in Next.js

import React, { useRef, useEffect, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { useSpreadsheetValidator } from './hooks/useSpreadsheetValidator';
import 'handsontable/dist/handsontable.full.min.css'; // Handsontable's CSS

// Register all Handsontable modules (essential for features like cell editing, etc.)
registerAllModules();

export default function Spreadsheet({ data, setData, refresh, highlightOn, setHighlightOn, }) {
    // Initial data for the spreadsheet, mimicking financial metrics
    // This is just example data. You would fetch your actual data here.
    const correctAnswers = { "1,1": "2355"};
    const hotTableComponent = useRef(null);
    const checkCell = useSpreadsheetValidator(hotTableComponent, correctAnswers);


    


    // Headers for columns. The first empty string is for the row headers column.
    const colHeaders = [
        '', // For the row label column
        '2014A', '2015A', '2016A', '2017A', '2018A',
        '2019P', '2020P', '2021P', '2022P'
    ];

    const afterChange = (changes, source) => {
        if (changes && source !== 'loadData') {
            changes.forEach(([row, col]) => {
                checkCell(row, col);
            });
        }
    };

    // useEffect for any Handsontable specific setup or cleanup
    useEffect(() => {
        // You can access the Handsontable instance via hotTableComponent.current.hotInstance
        // console.log(hotTableComponent.current.hotInstance);
    }, []);

    return (
        <div
            style={{
                width: '1000px', // Maintain the width from your original div
                backgroundColor: '#ffffff', // Set background to white for the spreadsheet itself
                border: '3px solid #1f3a60', // Add a border as seen in your mockup
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
                overflow: 'hidden', // Ensures borders are clean for inner Handsontable
            }}
        >
            <HotTable
                ref={hotTableComponent}
                data={data}
                colHeaders={colHeaders}
                rowHeaders={true}
                autoRowSize={true}
                height="auto"
                licenseKey="non-commercial-and-evaluation" // IMPORTANT: Use your actual license key in production
                                                          // For evaluation/non-commercial use, this key works.
                stretchH="all" // Stretches columns to fill the width
                width="100%"  // Makes the table fill the width of its container
                readOnly={false} // Allow editing cells, set to true if you want it read-only
                contextMenu={true} // Enable right-click context menu
                afterChange={afterChange} // Add the afterChange callback

                cells={(row, col) => {
                const cellProperties = {};
                if (highlightOn) {
                //if (col >= 1 && col <= 5) {
                //cellProperties.className = 'actuals-cell';}
                if (col >= 6) {
                cellProperties.className = 'forecasted-cell';}
                if (col >= 1 && (row == 6 || row == 8)) {
                cellProperties.className = 'derived-cell';}
                return cellProperties;
                }

            }}
                
                // minCols={5} // You can uncomment this if you need a minimum number of columns
                // autoRowSize={true} // Uncomment if you want rows to auto-size
                // autoColumnSize={true} // Uncomment if you want columns to auto-size
            />
        </div>
    );
}
