
import React from "react";

interface PhotoCounterProps {
  photosLeft: number;
  className?: string;
}

const PhotoCounter: React.FC<PhotoCounterProps> = ({ photosLeft, className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="bg-black text-white px-4 py-2 rounded-sm shadow-md border border-white/20">
        <span className="counter-text font-bold text-xl flex items-center">
          <span className="vintage-filter mr-2">
            {photosLeft < 10 ? `0${photosLeft}` : photosLeft}
          </span>
          <span className="text-xs uppercase tracking-widest">
            {photosLeft === 1 ? "exposure" : "exposures"} left
          </span>
        </span>
      </div>
    </div>
  );
};

export default PhotoCounter;
