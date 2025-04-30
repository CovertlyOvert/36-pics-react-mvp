
import React from "react";

interface PhotoCounterProps {
  photosLeft: number;
  className?: string;
}

const PhotoCounter: React.FC<PhotoCounterProps> = ({ photosLeft, className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="bg-black text-white px-4 py-2 rounded-md">
        <span className="counter-text font-bold text-xl">
          {photosLeft} {photosLeft === 1 ? "photo" : "photos"} left
        </span>
      </div>
    </div>
  );
};

export default PhotoCounter;
