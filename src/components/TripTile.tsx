
import React from "react";
import { Trip } from "../models/trip";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface TripTileProps {
  trip: Trip;
}

const TripTile: React.FC<TripTileProps> = ({ trip }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/gallery/${trip.id}`);
  };
  
  // Get a thumbnail photo if available
  const thumbnailPhoto = trip.photos.length > 0 ? trip.photos[0].path : null;
  
  return (
    <Card className="trip-card cursor-pointer" onClick={handleClick}>
      <CardContent className="p-0">
        {thumbnailPhoto ? (
          <div className="w-full h-40 overflow-hidden">
            <img
              src={thumbnailPhoto}
              alt={`${trip.name} thumbnail`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-40 bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">No photos</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start p-3">
        <h3 className="font-medium">{trip.name}</h3>
        <div className="flex justify-between w-full mt-1">
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(trip.startDate), { addSuffix: true })}
          </p>
          <p className="text-sm counter-text">
            {trip.photos.length}/36
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TripTile;
