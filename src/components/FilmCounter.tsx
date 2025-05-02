
import React, { useState, useEffect } from "react";
import { Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilmCounterProps {
  photosLeft: number;
  className?: string;
}

const FilmCounter: React.FC<FilmCounterProps> = ({ photosLeft, className }) => {
  const [blinkIcon, setBlinkIcon] = useState(false);
  
  // Blink effect for film roll icon
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkIcon(prev => !prev);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="bg-black/85 text-white px-4 py-2 rounded-sm shadow-md border border-white/20 flex items-center gap-2">
        <Film 
          className={cn(
            "h-5 w-5 transition-opacity", 
            blinkIcon ? "opacity-40" : "opacity-100"
          )} 
        />
        <span className="counter-text font-bold text-xl flex items-center">
          <span className="vintage-filter mr-1">
            {photosLeft < 10 ? `0${photosLeft}` : photosLeft}
          </span>
          <span className="text-xs uppercase tracking-widest ml-1">
            left
          </span>
        </span>
      </div>
    </div>
  );
};

export default FilmCounter;
