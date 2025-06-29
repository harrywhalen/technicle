"use client";

import React, { useRef, useEffect, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

import './globals.css';

registerAllModules();

export default function Spreadsheet({highlightOn, setHighlightOn, dataLoading, hotTableComponent, data, setData,initialData, refresh}) {


    // Column headers for the years
    const colHeaders = [
        'Metric', '2014A', '2015A', '2016A', '2017A', '2018A',
        '2019P', '2020P', '2021P', '2022P'
    ];

    const afterChange = (changes, source) => {
        if (changes && source !== 'loadData') {
            changes.forEach(([row, col]) => {
                console.log(`Cell changed: row ${row}, col ${col}`);
            });
        }
    };

    // Show loading state
    if (dataLoading) {
        return (
            <div style={{
                width: '1000px',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                border: '3px solid #1f3a60',
                zIndex: '1',
            }}>
                Loading spreadsheet...
            </div>
        );
    }

    return (
        <div
            style={{
                width: '1000px',
                backgroundColor: '#ffffff',
                border: '3px solid #1f3a60',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                //borderRadius: '0 0 8px 8px',
                overflow: 'hidden',
            }}
        >
            <HotTable
                ref={hotTableComponent}
                data={data}
                colHeaders={colHeaders}
                rowHeaders={false} // Disabled row headers since first column contains labels
                autoRowSize={true}
                licenseKey="non-commercial-and-evaluation"
                stretchH="all"
                width= "100%"
                height= "auto"
                readOnly={false}
                contextMenu={true}
                afterChange={afterChange}
                manualRowResize={true}
                manualColumnResize={true}
                columnSorting={true}
                columns={[
                    // First column for labels (read-only)
                    {
                        data: 0,
                        type: 'text',
                        readOnly: true,
                        className: 'htLeft htMiddle',
                        width: 150
                    },
                    // Remaining columns for numeric data
                    ...Array.from({ length: 9 }, (_, index) => ({
                        data: index + 1,
                        type: 'numeric',
                        numericFormat: {
                            pattern: '0,0'
                        },
                        className: 'htRight htMiddle'

        
                    }))]}

                cells={(row, col) => {
                const cellProperties = {};
                if (highlightOn) {
                if (row == 1 && col == 5) {
                cellProperties.className = 'shimmer-cell';}
                if (col >= 6) {
                cellProperties.className = 'forecasted-cell';}
                if (col >= 1 && (row == 6 || row == 8)) {
                cellProperties.className = 'derived-cell';}
                return cellProperties;
                }

            }}
            />
        </div>
    );
}
