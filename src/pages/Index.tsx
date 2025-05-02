
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TripTile from "@/components/TripTile";
import { usePhotoContext } from "@/context/PhotoContext";
import { Camera, Film } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { trips, activeTrip, loading } = usePhotoContext();

  const handleStartNewTrip = () => {
    navigate("/new-trip");
  };

  const handleContinueTrip = () => {
    if (activeTrip) {
      navigate(`/camera/${activeTrip.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="vintage-header mb-10 pt-8">
        <div className="flex items-center justify-center">
          <Film className="h-6 w-6 mr-2" />
          <h1 className="text-4xl font-bold">36 Pics</h1>
        </div>
        <div className="vintage-divider"></div>
        <p className="text-sm text-muted-foreground italic">Capture moments, not megapixels</p>
      </header>

      <main className="max-w-md mx-auto">
        {activeTrip ? (
          <div className="mb-8">
            <div className="vintage-container mb-4">
              <h2 className="text-xl font-semibold mb-2">Active Film Roll</h2>
              <div className="vintage-divider mx-auto"></div>
              <p className="mb-3 mt-4">{activeTrip.name}</p>
              <div className="counter-text mb-4 text-center py-1 px-3 bg-secondary/70 inline-block rounded-sm border border-border">
                {activeTrip.photos.length}/36 exposures
              </div>
              <Button 
                className="w-full film-button mt-2"
                onClick={handleContinueTrip}
              >
                <Camera className="mr-2 h-5 w-5" />
                Continue Shooting
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="vintage-container">
              <h2 className="text-xl font-semibold mb-2">New Adventure</h2>
              <div className="vintage-divider mx-auto"></div>
              <Button 
                className="w-full film-button mt-6"
                onClick={handleStartNewTrip}
              >
                Load New Film
              </Button>
            </div>
          </div>
        )}

        <div className="vintage-container">
          <h2 className="text-xl font-semibold mb-2">Developed Rolls</h2>
          <div className="vintage-divider mx-auto mb-6"></div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Developing...</p>
            </div>
          ) : trips.filter(trip => trip.isCompleted).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No developed film rolls yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {trips
                .filter(trip => trip.isCompleted)
                .sort((a, b) => b.startDate - a.startDate)
                .map(trip => (
                  <TripTile key={trip.id} trip={trip} />
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
