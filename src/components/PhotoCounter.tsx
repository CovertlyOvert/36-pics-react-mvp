
import React from "react";
import { Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoCounterProps {
  photosLeft: number;
  className?: string;
}

const PhotoCounter: React.FC<PhotoCounterProps> = ({ photosLeft, className }) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="bg-vintage-sepia text-white px-4 py-2 rounded-sm shadow-md border border-white/20 flex items-center gap-2">
        <Film className="h-5 w-5 opacity-90" />
        <span className="counter-text font-bold text-xl flex items-center">
          <span className="vintage-filter mr-1">
            {photosLeft < 10 ? `0${photosLeft}` : photosLeft}
          </span>
          <span className="text-xs uppercase tracking-widest ml-1">
            {photosLeft === 1 ? "exposure" : "exposures"} left
          </span>
        </span>
      </div>
    </div>
  );
};

export default PhotoCounter;
