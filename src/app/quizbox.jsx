"use client";
import React, { useState } from 'react';

export default function QuizBox({ question, options, correctAnswer }) {
    // State to manage the selected radio button value
    const [selectedOption, setSelectedOption] = useState('value_estimation'); // 'value_estimation' is pre-selected as per mockup

    // Handler for when a radio button is changed
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    // Handler for form submission (optional, can be expanded later)
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        console.log("Selected option:", selectedOption);
        // You can add logic here to check the answer, provide feedback, etc.
        // For now, it just logs the selection.
    };

    return(
        <div
            style={{
                width: '350px', // Matches the width of your TextBox for consistent column layout
                height: '100%',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff', // White background as in mockup
                    borderColor: '#1f3a60', // Dark blue border
                    borderWidth: '3px', // Changed to 3px to match mockup
                    borderStyle: 'solid',
                    color: '#1f3a60', // Dark blue text color
                    padding: '20px', // Padding inside the box
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
                    borderRadius: '10px 10px 0px 0px',
                }}
            >
<h4>
    {question || "No quiz question provided."} {/* If 'question' prop is empty, show default */}
</h4>

{options && options.length > 0 ? ( // Check if 'options' array exists and has items
    options.map((option, index) => ( // Loop through the 'options' array to create radio buttons
        <label key={index}>
            <input
                type="radio"
                name="dcf_quiz_option" // IMPORTANT: Changed 'dcf_use' to 'dcf_quiz_option' for better uniqueness
                                       // This name must be the same for all radios in a *single quiz group*.
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
                style={{ marginRight: '8px' }}
            />
            {option} {/* Display the current option text */}
        </label>
    ))
) : (
    <p style={{ fontSize: '0.9em', color: '#888' }}>No options available for this quiz.</p>
)}
<button
                        type="submit"
                        style={{
                            backgroundColor: '#3498db', // Blue background for button
                            color: 'white', // White text
                            padding: '10px 25px', // Padding inside button
                            border: 'none', // No border
                            borderRadius: '5px', // Rounded corners for button
                            cursor: 'pointer', // Hand cursor on hover
                            fontSize: '1em',
                            fontWeight: 'bold',
                            display: 'block', // Make button a block element
                            margin: '0 auto', // Center the button horizontally
                            transition: 'background-color 0.3s ease', // Smooth transition on hover
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#297bbd'} // Darker blue on hover
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3498db'} // Original blue
                    >
                        Submit
                    </button>
            </div>
            {/* The thin line below the box from your mockup */}
            <div
                style={{
                    height: '3px', // Increased height to match mockup's bottom line
                    backgroundColor: '#1f3a60', // Dark blue line
                    borderRadius: '0px 0px 15px 15px',
                }}
            >
            </div>
        </div>
    );
}
