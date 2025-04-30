
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TripTile from "@/components/TripTile";
import { usePhotoContext } from "@/context/PhotoContext";
import { Camera } from "lucide-react";

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
      <header className="flex justify-center mb-8 pt-8">
        <h1 className="text-4xl font-bold">36 Pics</h1>
      </header>

      <main className="max-w-md mx-auto">
        {activeTrip ? (
          <div className="mb-8">
            <div className="bg-secondary p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold mb-2">Active Trip</h2>
              <p className="mb-3">{activeTrip.name}</p>
              <p className="counter-text mb-4">
                {activeTrip.photos.length}/36 photos taken
              </p>
              <Button 
                className="w-full film-button"
                onClick={handleContinueTrip}
              >
                <Camera className="mr-2 h-5 w-5" />
                Continue Trip
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            className="w-full film-button mb-8"
            onClick={handleStartNewTrip}
          >
            Start New Trip
          </Button>
        )}

        <h2 className="text-xl font-semibold mb-4">Past Trips</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <p>Loading trips...</p>
          </div>
        ) : trips.filter(trip => trip.isCompleted).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No past trips yet</p>
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
      </main>
    </div>
  );
};

export default Index;
