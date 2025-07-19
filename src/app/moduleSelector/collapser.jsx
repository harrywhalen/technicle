"use client";
import React from "react";
import { ChevronDown  } from "lucide-react";

export default function Collapser({setCollapsed}) {


  return (
<button
onClick={() => setCollapsed(prev => !prev)}
style = {{
    position: 'relative',
    height: '5vh',
    width: '2.5vw',
    backgroundColor: '#00bfff',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#00bfff',
    borderRadius: '10px',
    Zindex: '1',
    marginLeft: '1.5vw',
    marginTop: '1.15vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

}}
>
<ChevronDown color="#FFFFFF" size={34} />  
</button>


  )}