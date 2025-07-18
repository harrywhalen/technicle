"use client"
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import "./backslider.css";

const images = [
  "/3cfbef92-0d71-4e0f-8365-2b3e4ad8a056.jpeg",
  "/IncomeStatement.png",
  "/1_NH7UAokW4jcPNw6TuZ41xw.png",
];

function BackSliderComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="background-slider">
      {images.map((img, index) => (
        <div
          key={index}
          className={`bg-image ${index === currentIndex ? "visible" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
    </div>
  );
}

// Export as a dynamic component with SSR disabled
const BackSlider = dynamic(() => Promise.resolve(BackSliderComponent), {
  ssr: false,
  loading: () => (
    <div className="background-slider">
      <div 
        className="bg-image visible" 
        style={{ backgroundImage: `url(${images[0]})` }}
      />
    </div>
  )
});

export default BackSlider;