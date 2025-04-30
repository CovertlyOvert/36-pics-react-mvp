
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import PhotoCounter from "@/components/PhotoCounter";
import { usePhotoContext } from "@/context/PhotoContext";
import { ArrowLeft, Camera, Image } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CameraScreen = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { activeTrip, addPhotoToTrip, refreshTrips } = usePhotoContext();
  const { toast } = useToast();
  
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
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
    if (!videoRef.current || !canvasRef.current || !tripId) return;
    
    setIsTakingPhoto(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const photoData = canvas.toDataURL("image/jpeg");
      
      // Save photo
      await addPhotoToTrip(tripId, photoData);
      
      // Refresh to get latest count
      await refreshTrips();
      
      toast({
        title: "Photo taken!",
        description: activeTrip && activeTrip.photos.length < 35 
          ? `${35 - activeTrip.photos.length} photos left` 
          : "Last photo!",
      });
      
      // If this was the 36th photo, go to gallery
      if (activeTrip && activeTrip.photos.length >= 36) {
        toast({
          title: "Trip complete!",
          description: "You've taken all 36 photos for this trip",
        });
        navigate(`/gallery/${tripId}`);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      toast({
        title: "Error",
        description: "Failed to take photo",
        variant: "destructive",
      });
    } finally {
      setIsTakingPhoto(false);
    }
  };
  
  const viewGallery = () => {
    if (tripId) {
      navigate(`/gallery/${tripId}`);
    }
  };
  
  // Calculate photos left
  const photosLeft = activeTrip ? 36 - activeTrip.photos.length : 0;
  const photosCount = activeTrip ? activeTrip.photos.length : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <PhotoCounter photosLeft={photosLeft} />
        
        <Button 
          variant="ghost" 
          onClick={viewGallery}
        >
          <Image className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-grow flex flex-col relative">
        <div className="relative flex-grow flex justify-center items-center bg-black">
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
        </div>
      </main>

      <footer className="p-4 flex justify-center">
        <Button
          className="rounded-full w-16 h-16 bg-white border-2 border-black hover:bg-gray-100"
          disabled={isTakingPhoto || photosLeft === 0}
          onClick={takePhoto}
        >
          <Camera className="h-8 w-8 text-black" />
        </Button>
      </footer>
    </div>
  );
};

export default CameraScreen;
