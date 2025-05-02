
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { usePhotoContext } from "@/context/PhotoContext";
import { ArrowLeft, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Trip, Photo } from "@/models/trip";
import { format } from "date-fns";

const GalleryScreen = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, activeTrip, refreshTrips } = usePhotoContext();
  const { toast } = useToast();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
    };
    
    loadTrip();
  }, [tripId, refreshTrips, trips, toast, navigate]);
  
  const handleContinueShooting = () => {
    if (tripId && !trip?.isCompleted) {
      navigate(`/camera/${tripId}`);
    }
  };
  
  const photosLeft = trip ? 36 - trip.photos.length : 0;
  const tripComplete = trip?.isCompleted;

  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <h1 className="text-lg font-medium">{trip?.name || "Gallery"}</h1>
        
        {!tripComplete && photosLeft > 0 && (
          <Button 
            variant="ghost"
            onClick={handleContinueShooting}
          >
            <Camera className="h-6 w-6" />
          </Button>
        )}
        {(tripComplete || photosLeft === 0) && <div className="w-10" />}
      </header>

      <main className="p-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading photos...</p>
          </div>
        ) : trip?.photos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No photos yet</p>
            {!tripComplete && (
              <Button 
                className="mt-4 film-button"
                onClick={handleContinueShooting}
              >
                Start taking photos
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-center">
              <span className="counter-text font-medium">
                {trip?.photos.length}/36 photos
                {photosLeft > 0 && !tripComplete && ` (${photosLeft} remaining)`}
              </span>
            </div>
            
            <div className="photo-grid">
              {trip?.photos.map(photo => (
                <div 
                  key={photo.id} 
                  className="relative aspect-square overflow-hidden cursor-pointer film-frame"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img 
                    src={photo.path} 
                    alt={`Photo ${photo.id}`} 
                    className="w-full h-full object-cover vintage-filter"
                  />
                </div>
              ))}
            </div>
            
            {!tripComplete && photosLeft > 0 && (
              <div className="mt-8 flex justify-center">
                <Button 
                  className="film-button"
                  onClick={handleContinueShooting}
                >
                  Continue Trip ({photosLeft} photos left)
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="sm:max-w-lg p-0 bg-black">
          {selectedPhoto && (
            <div>
              <img 
                src={selectedPhoto.path} 
                alt={`Photo ${selectedPhoto.id}`} 
                className="w-full h-auto"
              />
              <div className="p-4 text-white">
                <p className="text-sm opacity-80">
                  Taken {format(new Date(selectedPhoto.timestamp), "MMM d, yyyy 'at' h:mm aaa")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryScreen;
