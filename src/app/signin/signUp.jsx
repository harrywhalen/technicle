"use client"           
import React, {useState} from 'react';
import SignPitch from "./signPitch.jsx"
import EntryBoxes from "./entryBoxes.jsx"

export default function SignUp() {

let top;
let bottom;

const [createState, setCreateState] = useState(false);

if (createState) {
  top = "Create Account";
  bottom = "Sign In";
} else {
  top = "Sign In";
  bottom = "Create Account";
}

return(
<div
    type="submit"
    style={{
        height: '600px',
        width: '600px',
        backgroundColor: '#FFFFFF', // Blue background for button
        color: 'white', // White text
        padding: '10px 25px', // Padding inside button
        borderWidth: "4px",      // 3px * 0.8
        borderStyle: "solid",
        borderColor: "#1f3a60",
        borderRadius: "24px",      // 30px * 0.8
        borderRadius: '50px',
        opacity: '1',
        zIndex: '5',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)'
    }}
>
    <SignPitch
    createState = {createState}
    setCreateState = {setCreateState}
    top = {top}
    bottom = {bottom}
    />
    <EntryBoxes
    top = {top}
    />
</div>


)}


