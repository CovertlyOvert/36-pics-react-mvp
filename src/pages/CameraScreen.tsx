
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { usePhotoContext } from "@/context/PhotoContext";
import { ArrowLeft, Camera, Image } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ViewfinderOverlay from "@/components/ViewfinderOverlay";
import FilmCounter from "@/components/FilmCounter";

const CameraScreen = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { activeTrip, addPhotoToTrip, refreshTrips } = usePhotoContext();
  const { toast } = useToast();
  
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isShutterActive, setIsShutterActive] = useState(false);
  const [isCameraShaking, setIsCameraShaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shutterAudioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element for shutter sound
    shutterAudioRef.current = new Audio("/shutter-click.mp3");
    shutterAudioRef.current.volume = 0.7;
    
    // Ensure we have an active trip
    if (!activeTrip) {
      toast({
        title: "No active trip",
        description: "Please start a new trip first",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    
    // Start camera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" }, 
          audio: false 
        });
        setCameraStream(stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          title: "Camera Error",
          description: "Unable to access camera. Please check permissions.",
          variant: "destructive",
        });
      }
    };
    
    startCamera();
    
    // Clean up
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeTrip, navigate, toast]);
  
  useEffect(() => {
    // Check that our trip ID matches active trip
    if (activeTrip && tripId !== activeTrip.id) {
      navigate(`/camera/${activeTrip.id}`);
    }
  }, [activeTrip, tripId, navigate]);
  
  const takePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !tripId || isRollComplete) return;
    
    setIsTakingPhoto(true);
    
    try {
      // Play shutter sound
      if (shutterAudioRef.current) {
        shutterAudioRef.current.play().catch(err => console.error("Could not play shutter sound:", err));
      }
      
      // Trigger shutter animation
      setIsShutterActive(true);
      
      // Add camera shake effect
      setIsCameraShaking(true);
      
      // Wait a moment for the shutter effect
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Apply vintage filter effect to the canvas
      applyVintageEffect(ctx, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const photoData = canvas.toDataURL("image/jpeg");
      
      // Save photo
      await addPhotoToTrip(tripId, photoData);
      
      // Refresh to get latest count
      await refreshTrips();
      
      toast({
        title: "Photo taken!",
        description: activeTrip && activeTrip.photos.length < 35 
          ? `${35 - activeTrip.photos.length} exposures left` 
          : "Last exposure!",
      });
      
      // If this was the 36th photo, go to gallery
      if (activeTrip && activeTrip.photos.length >= 36) {
        toast({
          title: "Film roll complete!",
          description: "You've taken all 36 exposures for this roll",
        });
        navigate(`/gallery/${tripId}`);
      }
      
      // Reset shutter and camera shake after a brief delay
      setTimeout(() => {
        setIsShutterActive(false);
        setIsCameraShaking(false);
        setIsTakingPhoto(false);
      }, 400);
      
    } catch (error) {
      console.error("Error taking photo:", error);
      toast({
        title: "Error",
        description: "Failed to take photo",
        variant: "destructive",
      });
      setIsShutterActive(false);
      setIsCameraShaking(false);
      setIsTakingPhoto(false);
    }
  };
  
  // Apply vintage effect to canvas
  const applyVintageEffect = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Apply sepia effect
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Sepia conversion
      data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
      data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
      
      // Add subtle noise for film grain effect
      if (Math.random() > 0.97) {
        const noise = Math.random() * 20 - 10;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }
      
      // Slight contrast boost
      data[i] = Math.min(255, data[i] * 1.05);
      data[i + 1] = Math.min(255, data[i + 1] * 1.05);
      data[i + 2] = Math.min(255, data[i + 2] * 1.05);
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Add subtle vignette effect
    ctx.save();
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 1.8
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.2)');
    ctx.fillStyle = gradient;
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  };
  
  const viewGallery = () => {
    if (tripId) {
      navigate(`/gallery/${tripId}`);
    }
  };
  
  // Calculate photos left
  const photosLeft = activeTrip ? 36 - activeTrip.photos.length : 0;
  const photosCount = activeTrip ? activeTrip.photos.length : 0;
  const isRollComplete = photosLeft <= 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <FilmCounter photosLeft={photosLeft} />
        
        <Button 
          variant="ghost" 
          onClick={viewGallery}
        >
          <Image className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-grow flex flex-col relative">
        <div className={`relative flex-grow flex justify-center items-center bg-black ${isCameraShaking ? 'animate-[shake_0.2s_ease-in-out]' : ''}`}>
          {/* Video element for camera preview */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            className="h-full w-full object-cover"
          />
          
          {/* Invisible canvas for capturing frames */}
          <canvas 
            ref={canvasRef} 
            className="hidden"
          />
          
          {/* Viewfinder overlay */}
          <ViewfinderOverlay />
          
          {/* Shutter overlay effect */}
          {isShutterActive && (
            <div className="absolute inset-0 bg-white z-20 animate-[white-flash_300ms_ease-in-out]"></div>
          )}
        </div>
      </main>

      <footer className="p-4 flex flex-col items-center">
        {isRollComplete ? (
          <div className="text-center mb-2">
            <p className="counter-text text-muted-foreground">Roll Complete. Live the moment.</p>
          </div>
        ) : null}
        
        <Button
          className={`rounded-full w-16 h-16 bg-white border-2 border-black hover:bg-gray-100 ${isRollComplete ? 'opacity-50' : ''}`}
          disabled={isTakingPhoto || isRollComplete}
          onClick={takePhoto}
        >
          <Camera className="h-8 w-8 text-black" />
        </Button>
      </footer>
    </div>
  );
};

export default CameraScreen;
