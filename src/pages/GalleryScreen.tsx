
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { usePhotoContext } from "@/context/PhotoContext";
import { ArrowLeft, Download, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Trip, Photo } from "@/models/trip";
import { format } from "date-fns";
import PhotoCounter from "@/components/PhotoCounter";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHapticFeedback } from "@/utils/hapticFeedback";

const GalleryScreen = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, activeTrip, refreshTrips } = usePhotoContext();
  const { toast } = useToast();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  
  useEffect(() => {
    const loadTrip = async () => {
      setIsLoading(true);
      await refreshTrips();
      
      if (!tripId) {
        toast({
          title: "Error",
          description: "Trip not found",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      
      const foundTrip = trips.find(t => t.id === tripId);
      if (!foundTrip) {
        toast({
          title: "Error",
          description: "Trip not found",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      
      setTrip(foundTrip);
      setIsLoading(false);
      
      // Hide intro animation after 1.5 seconds
      setTimeout(() => {
        setShowIntro(false);
      }, 1500);
    };
    
    loadTrip();
  }, [tripId, refreshTrips, trips, toast, navigate]);
  
  const handleContinueShooting = () => {
    triggerHapticFeedback('light');
    if (tripId && !trip?.isCompleted) {
      navigate(`/camera/${tripId}`);
    }
  };
  
  const handleDownloadAll = () => {
    // Provide haptic feedback
    triggerHapticFeedback('medium');
    
    // In a real implementation, this would trigger the download
    // For this demo, we'll just show a toast
    toast({
      title: "Export Started",
      description: `Exporting ${trip?.photos.length} photos from "${trip?.name}"`,
    });
  };
  
  const handlePhotoClick = (photo: Photo) => {
    triggerHapticFeedback('light');
    setSelectedPhoto(photo);
  };
  
  const photosLeft = trip ? 36 - trip.photos.length : 0;
  const tripComplete = trip?.isCompleted;

  const formattedStartDate = trip?.startDate 
    ? format(new Date(trip.startDate), "MMMM d, yyyy")
    : "";

  return (
    <motion.div 
      className="min-h-screen bg-background aged-paper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="p-4 flex justify-between items-center">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </motion.div>
        
        <div className="flex-1" />
        
        {!tripComplete && photosLeft > 0 && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              variant="ghost"
              onClick={handleContinueShooting}
              className="hover:bg-muted"
            >
              <Camera className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
        {(tripComplete || photosLeft === 0) && <div className="w-10" />}
      </header>

      {!isLoading && trip && (
        <motion.div 
          className="vintage-container mx-4 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="vintage-header mb-6">
            <h1 className="text-2xl font-bold">{trip.name}</h1>
            <div className="vintage-divider"></div>
            <p className="counter-text text-sm text-muted-foreground">{formattedStartDate}</p>
          </div>
        </motion.div>
      )}

      <main className="px-4 pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Developing film...</p>
          </div>
        ) : trip?.photos.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-muted-foreground">No exposures yet</p>
            {!tripComplete && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  className="mt-4 film-button"
                  onClick={handleContinueShooting}
                >
                  Start taking photos
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="mb-4 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <PhotoCounter photosLeft={photosLeft} />
            </motion.div>
            
            <div className={`photo-grid ${showIntro ? 'animate-fade-in' : ''}`}>
              {trip?.photos.map((photo, index) => (
                <motion.div 
                  key={photo.id} 
                  className="relative aspect-square overflow-hidden cursor-pointer film-frame"
                  initial={{ 
                    opacity: 0,
                    y: 20,
                    rotate: Math.random() * 6 - 3
                  }}
                  animate={{ 
                    opacity: 1,
                    y: 0,
                    transition: { 
                      delay: index * 0.05 + 0.2,
                      duration: 0.4
                    }
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ 
                    scale: 1.03,
                    rotate: 0,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => handlePhotoClick(photo)}
                >
                  <img 
                    src={photo.path} 
                    alt={`Photo ${photo.id}`} 
                    className="w-full h-full object-cover vintage-filter"
                  />
                </motion.div>
              ))}
            </div>
            
            {!tripComplete && photosLeft > 0 && (
              <motion.div 
                className="mt-8 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button 
                  className="film-button"
                  onClick={handleContinueShooting}
                >
                  Continue Trip ({photosLeft} exposures left)
                </Button>
              </motion.div>
            )}
            
            {trip?.photos.length > 0 && (
              <motion.div 
                className="mt-8 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button 
                  className="film-button flex items-center gap-2"
                  onClick={handleDownloadAll}
                >
                  <Download size={16} />
                  Export Film Roll
                </Button>
              </motion.div>
            )}
          </>
        )}
      </main>
      
      <AnimatePresence>
        {selectedPhoto && (
          <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
            <DialogContent className="sm:max-w-lg p-0 bg-black overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              >
                <img 
                  src={selectedPhoto.path} 
                  alt={`Photo ${selectedPhoto.id}`} 
                  className="w-full h-auto"
                />
                <div className="p-4 text-white">
                  <p className="counter-text text-sm opacity-80">
                    {format(new Date(selectedPhoto.timestamp), "MMM d, yyyy 'at' h:mm aaa")}
                  </p>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GalleryScreen;
