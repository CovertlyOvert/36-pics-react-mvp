
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { usePhotoContext } from "@/context/PhotoContext";
import { ArrowLeft } from "lucide-react";

const NewTrip = () => {
  const [tripName, setTripName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { createNewTrip } = usePhotoContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tripName.trim()) {
      setError("Trip name is required");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const newTrip = await createNewTrip(tripName.trim());
      navigate(`/camera/${newTrip.id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create trip";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="mb-8 pt-4">
        <Button 
          variant="ghost" 
          className="p-0" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </header>

      <main className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Start New Trip</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="tripName" className="block mb-2 text-lg">
              Trip Name
            </label>
            <Input
              id="tripName"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="e.g., Weekend in Paris"
              className="text-lg p-6"
              autoFocus
            />
            {error && <p className="text-destructive mt-2">{error}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full film-button text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Start Trip"}
          </Button>
          
          <p className="mt-6 text-center text-muted-foreground">
            You'll have exactly 36 photos for this trip.
            <br />Choose your shots carefully!
          </p>
        </form>
      </main>
    </div>
  );
};

export default NewTrip;
