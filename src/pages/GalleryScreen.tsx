
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
    if (tripId && !trip?.isCompleted) {
      navigate(`/camera/${tripId}`);
    }
  };
  
  const handleDownloadAll = () => {
    // In a real implementation, this would trigger the download
    // For this demo, we'll just show a toast
    toast({
      title: "Export Started",
      description: `Exporting ${trip?.photos.length} photos from "${trip?.name}"`,
    });
  };
  
  const photosLeft = trip ? 36 - trip.photos.length : 0;
  const tripComplete = trip?.isCompleted;

  const formattedStartDate = trip?.startDate 
    ? format(new Date(trip.startDate), "MMMM d, yyyy")
    : "";

  return (
    <div className="min-h-screen bg-background aged-paper">
      <header className="p-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <div className="flex-1" />
        
        {!tripComplete && photosLeft > 0 && (
          <Button 
            variant="ghost"
            onClick={handleContinueShooting}
            className="hover:bg-muted"
          >
            <Camera className="h-6 w-6" />
          </Button>
        )}
        {(tripComplete || photosLeft === 0) && <div className="w-10" />}
      </header>

      {!isLoading && trip && (
        <div className="vintage-container mx-4 mb-6 animate-fade-in">
          <div className="vintage-header mb-6">
            <h1 className="text-2xl font-bold">{trip.name}</h1>
            <div className="vintage-divider"></div>
            <p className="counter-text text-sm text-muted-foreground">{formattedStartDate}</p>
          </div>
        </div>
      )}

      <main className="px-4 pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Developing film...</p>
          </div>
        ) : trip?.photos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No exposures yet</p>
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
            <div className="mb-4 flex items-center justify-center">
              <PhotoCounter photosLeft={photosLeft} />
            </div>
            
            <div className={`photo-grid ${showIntro ? 'animate-fade-in' : ''}`}>
              {trip?.photos.map((photo, index) => (
                <div 
                  key={photo.id} 
                  className={`relative aspect-square overflow-hidden cursor-pointer film-frame animate-fade-in`}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    transform: showIntro ? `rotate(${Math.random() * 6 - 3}deg)` : 'none',
                    transition: 'transform 0.5s ease-out'
                  }}
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
                  Continue Trip ({photosLeft} exposures left)
                </Button>
              </div>
            )}
            
            {trip?.photos.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button 
                  className="film-button flex items-center gap-2"
                  onClick={handleDownloadAll}
                >
                  <Download size={16} />
                  Export Film Roll
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
                <p className="counter-text text-sm opacity-80">
                  {format(new Date(selectedPhoto.timestamp), "MMM d, yyyy 'at' h:mm aaa")}
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
