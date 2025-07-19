"use client";
import {React, useState} from "react";
import ModBox from "./moduleBox.jsx";
import DaName from "./daName.jsx";
import DaProg from "./daProg.jsx";
import ModGrid from "./modGrid.jsx";
import Collapser from "./collapser.jsx";

const modules = [
  { id: 1, title1: "TEST MODULE", title2: "React Basics", subtitle1: "React Basics", subtitle2: "React Basics", progress: 100 },
  { id: 2, title1: "State Management", title2: "React Basics",  subtitle1: "React Basics", subtitle2: "React Basics", progress: 100 },
  { id: 3, title1: "Hooks",  title2: "React Basics",  subtitle1: "React Basics", subtitle2: "React Basics", progress: 100 },
  { id: 4, title1: "Routing", title2: "React Basics",  subtitle1: "React Basics", subtitle2: "React Basics", progress: 100 },
  { id: 5, title1: "Testing",  title2: "React Basics",  subtitle1: "React Basics", subtitle2: "React Basics", progress: 100 },
  { id: 6, title1: "Performance",  title2: "React Basics",  subtitle1: "React Basics", subtitle2: "React Basics", progress: 38 },
  { id: 7, title1: "Deployment",  title2: "React Basics",  subtitle1: "React Basics", subtitle2: "React Basics", progress: 0 },
  { id: 8, title1: "Advanced Patterns",  title2: "React Basics",  subtitle1: "React Basics", subtitle2: "React Basics", progress: 0 },
  { id: 9, title1: "Security",  title2: "React Basics",  subtitle1: "React Basics", subtitle2: "React Basics", progress: 0 },
  { id: 10, title1: "Accessibility",  title2: "React Basics",  subtitle1: "React Basics", subtitle2: "React Basics", progress: 0 },
  { id: 11, title1: "DevOps",  title2: "React Basics",  subtitle1: "React Basics", subtitle2: "React Basics", progress: 0 },
  { id: 12, title1: "Wrap-up",  title2: "React Basics",  subtitle1: "React Basics", subtitle2: "React Basics", progress: 0 },
  { id: 13, title1: "DevOps",  title2: "React Basics",  subtitle1: "React Basics", subtitle2: "React Basics", progress: 0 },
  { id: 14, title1: "Wrap-up",  title2: "React Basics",  subtitle1: "React Basics", subtitle2: "React Basics", progress: 0 },
];



 const updatedModules = modules.map((module, index, array) => {
  if (index === 0) {
    // First module is always unlocked
    return { ...module, isUnlocked: true };
  }

  const prevModule = array[index - 1];
  const isUnlocked = prevModule.progress >= 100;

  return {
    ...module,
    isUnlocked
  };
});

 const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0);




export default function MS() {
  const [groupCollapsed, setCollapsed] = useState(false);
  return (
    <div
      style={{
        height: groupCollapsed ? "100px" : "450px",
        width: "73vw", // 1000px * 0.8
        backgroundColor: "#e6f4f9",
        borderWidth: "2px", // 2px * 0.8
        borderStyle: "solid",
        borderColor: "#00bfff",
        borderRadius: "40px", // 50px * 0.8
        marginTop: '40px',
        marginLeft: '13vw',
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >

      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Collapser
        setCollapsed={setCollapsed}
        />
        <DaName />
        <DaProg 
        totalProgress = {totalProgress}
        />
        </div>


        {!groupCollapsed && <ModGrid modules={updatedModules} />}


      </div>
    </div>
  );
}
