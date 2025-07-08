import { useEffect, useState } from "react";
import "./backSlider.css";

const images = [
  "/3cfbef92-0d71-4e0f-8365-2b3e4ad8a056.jpeg",
  "/IncomeStatement.png",
  "/1_NH7UAokW4jcPNw6TuZ41xw.png",
];

export default function BackSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
    className="background-slider"
    style = {{
        zIndex: '-2',
        position: 'absolute',
    }}
    >
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
