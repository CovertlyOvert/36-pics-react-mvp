
import React from "react";
import { cn } from "@/lib/utils";

interface ViewfinderOverlayProps {
  className?: string;
}

const ViewfinderOverlay: React.FC<ViewfinderOverlayProps> = ({ className }) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none z-10", className)}>
      {/* Center circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[70vw] h-[70vw] max-w-[350px] max-h-[350px] border-[3px] border-white/80 rounded-full"></div>
        
        {/* Crosshairs */}
        <div className="absolute w-[72vw] h-[72vw] max-w-[370px] max-h-[370px]">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/60 transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 top-0 h-full w-[2px] bg-white/60 transform -translate-x-1/2"></div>
        </div>

        {/* Small center circle */}
        <div className="w-4 h-4 border-2 border-white/90 rounded-full"></div>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/80"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/80"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/80"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/80"></div>

      {/* Vignette effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-radial from-transparent to-black/40 pointer-events-none"></div>
    </div>
  );
};

export default ViewfinderOverlay;
