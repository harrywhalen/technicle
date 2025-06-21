"use client"; // This directive is necessary for client-side components in Next.js

import React, { useRef, useEffect, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { useSpreadsheetValidator } from './hooks/useSpreadsheetValidator';
import 'handsontable/dist/handsontable.full.min.css'; // Handsontable's CSS

// Register all Handsontable modules (essential for features like cell editing, etc.)
registerAllModules();

export default function Spreadsheet() {
    // Initial data for the spreadsheet, mimicking financial metrics
    // This is just example data. You would fetch your actual data here.
    const correctAnswers = { "1,1": "2355"};
    const hotTableComponent = useRef(null);
    const checkCell = useSpreadsheetValidator(hotTableComponent, correctAnswers);


    
const [data, setData] = useState([
  ['', '2014A', '2015A', '2016A', '2017A', '2018A', '2019P', '2020P', '2021P', '2022P'],
  ['Revenue', 2355, 3562, 4102, 4663, 5036, 5368, 5711, 5957, 6287],
  ['COGS', -1458, -2562, -2879, -3331, -3554, -3768, -4031, -4187, -4439],
  ['Gross Profit', 897, 1000, 1223, 1332, 1482, 1600, 1680, 1770, 1848],
  ['R&D Expense', -120, -135, -150, -162, -170, -176, -180, -184, -190],
  ['SG&A Expense', -60, -65, -70, -72, -78, -82, -85, -88, -90],
  ['EBITDA', 717, 800, 1003, 1098, 1234, 1342, 1415, 1498, 1568],
  ['Depreciation & Amort.', -43, -49, -75, -84, -88, -95, -100, -102, -110],
  ['EBIT', 674, 751, 928, 1014, 1146, 1247, 1315, 1396, 1458],
  ['Interest Expense', -45, -48, -52, -54, -56, -58, -60, -60, -60],
  ['EBT', 629, 703, 876, 960, 1090, 1189, 1255, 1336, 1398],
  ['Tax @ 25.2%', -159, -177, -221, -242, -275, -299, -317, -337, -352],
  ['Net Income', 470, 526, 655, 718, 815, 890, 938, 999, 1046],
  ['+ D&A', 43, 49, 75, 84, 88, 95, 100, 102, 110],
  ['- CapEx', -25, -28, -32, -35, -40, -45, -50, -55, -60],
  ['- Change in NWC', -2, -3, -4, -5, -6, -7, -8, -9, -10],
  ['Unlevered FCF', 486, 544, 694, 762, 857, 933, 980, 1037, 1086],
  ['Discount Factor (10%)', 1.00, 0.91, 0.83, 0.75, 0.68, 0.62, 0.56, 0.51, 0.47],
  ['Discounted FCF', 486, 495, 576, 572, 583, 578, 549, 529, 511],
  ['Terminal Value', '', '', '', '', '', '', '', '', 8030],
  ['Discounted TV', '', '', '', '', '', '', '', '', 3774],
]);

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
                borderRadius: ' 0 0 8px 8px', // Rounded corners for the container
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

                
                // minCols={5} // You can uncomment this if you need a minimum number of columns
                // autoRowSize={true} // Uncomment if you want rows to auto-size
                // autoColumnSize={true} // Uncomment if you want columns to auto-size
            />
        </div>
    );
}
