
import React, { createContext, useContext, useState, useEffect } from "react";
import { Trip } from "../models/trip";
import * as photoService from "../services/photoService";
import { useToast } from "@/components/ui/use-toast";

interface PhotoContextType {
  trips: Trip[];
  activeTrip: Trip | null;
  loading: boolean;
  createNewTrip: (name: string) => Promise<Trip>;
  addPhotoToTrip: (tripId: string, photoData: string) => Promise<void>;
  completeTrip: (tripId: string) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  refreshTrips: () => Promise<void>;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const usePhotoContext = () => {
  const context = useContext(PhotoContext);
  if (context === undefined) {
    throw new Error("usePhotoContext must be used within a PhotoProvider");
  }
  return context;
};

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshTrips = async () => {
    setLoading(true);
    try {
      const allTrips = await photoService.getTrips();
      setTrips(allTrips);
      
      // Find active trip
      const active = allTrips.find(trip => !trip.isCompleted) || null;
      setActiveTrip(active);
    } catch (error) {
      console.error("Failed to load trips:", error);
      toast({
        title: "Error",
        description: "Failed to load trips",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTrips();
  }, []);

  const createNewTrip = async (name: string): Promise<Trip> => {
    try {
      const newTrip = await photoService.createTrip(name);
      await refreshTrips();
      return newTrip;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create trip";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const addPhotoToTrip = async (tripId: string, photoData: string): Promise<void> => {
    try {
      await photoService.addPhotoToTrip(tripId, photoData);
      await refreshTrips();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add photo";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const completeTrip = async (tripId: string): Promise<void> => {
    try {
      await photoService.completeTrip(tripId);
      await refreshTrips();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to complete trip";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTrip = async (tripId: string): Promise<void> => {
    try {
      await photoService.deleteTrip(tripId);
      await refreshTrips();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete trip";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value: PhotoContextType = {
    trips,
    activeTrip,
    loading,
    createNewTrip,
    addPhotoToTrip,
    completeTrip,
    deleteTrip,
    refreshTrips,
  };

  return <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>;
};
