
import { Trip, Photo } from "../models/trip";

// In-memory storage for now
// In a real application, we'd use IndexedDB or another browser storage mechanism
let trips: Trip[] = [];

const loadTrips = (): Promise<Trip[]> => {
  const storedTrips = localStorage.getItem('trips');
  if (storedTrips) {
    trips = JSON.parse(storedTrips);
  }
  return Promise.resolve(trips);
};

const saveTrips = (): Promise<void> => {
  localStorage.setItem('trips', JSON.stringify(trips));
  return Promise.resolve();
};

export const getTrips = async (): Promise<Trip[]> => {
  await loadTrips();
  return trips;
};

export const getActiveTrip = async (): Promise<Trip | undefined> => {
  await loadTrips();
  return trips.find(trip => !trip.isCompleted);
};

export const getTrip = async (id: string): Promise<Trip | undefined> => {
  await loadTrips();
  return trips.find(trip => trip.id === id);
};

export const createTrip = async (name: string): Promise<Trip> => {
  await loadTrips();
  
  // Check if there's already an active trip
  const activeTrip = trips.find(trip => !trip.isCompleted);
  if (activeTrip) {
    throw new Error("You already have an active trip. Please complete it before starting a new one.");
  }
  
  const newTrip: Trip = {
    id: Date.now().toString(),
    name,
    startDate: Date.now(),
    photos: [],
    isCompleted: false
  };
  
  trips.push(newTrip);
  await saveTrips();
  return newTrip;
};

export const addPhotoToTrip = async (tripId: string, photoData: string): Promise<Photo> => {
  await loadTrips();
  
  const trip = trips.find(t => t.id === tripId);
  if (!trip) {
    throw new Error("Trip not found");
  }
  
  if (trip.photos.length >= 36) {
    throw new Error("This trip already has 36 photos");
  }
  
  const newPhoto: Photo = {
    id: Date.now().toString(),
    path: photoData,
    timestamp: Date.now()
  };
  
  trip.photos.push(newPhoto);
  
  // If this is the 36th photo, complete the trip
  if (trip.photos.length === 36) {
    trip.isCompleted = true;
    trip.endDate = Date.now();
  }
  
  await saveTrips();
  return newPhoto;
};

export const completeTrip = async (tripId: string): Promise<Trip> => {
  await loadTrips();
  
  const trip = trips.find(t => t.id === tripId);
  if (!trip) {
    throw new Error("Trip not found");
  }
  
  trip.isCompleted = true;
  trip.endDate = Date.now();
  
  await saveTrips();
  return trip;
};

export const deleteTrip = async (tripId: string): Promise<void> => {
  await loadTrips();
  trips = trips.filter(trip => trip.id !== tripId);
  await saveTrips();
};
