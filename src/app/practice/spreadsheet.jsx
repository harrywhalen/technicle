'use client';

import React from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';

import './globals.css';

export default function Spreadsheet() {
  const data = [
    ['Name', 'Age', 'City'],
    ['Alice', 30, 'New York'],
    ['Bob', 25, 'London'],
    ['Charlie', 35, 'Paris']
  ];

  return (
    <div className="p-4">
      <HotTable
        data={data}
        colHeaders={true}
        rowHeaders={true}
        width={800}
        height={550}
        minRows={20}
        minCols={15}
        stretchH="all"
        licenseKey="non-commercial-and-evaluation"
        cells={(row, col) => {
         const classes = [];
        // Zebra striping
        if (row % 2 === 1) {

          classes.push('even-row');
        }
                    return {
            className: classes.join(' '),
          };
        }}
      />
    </div>
  );
}
