
export interface Photo {
  id: string;
  path: string;
  timestamp: number;
}

export interface Trip {
  id: string;
  name: string;
  startDate: number;
  endDate?: number;
  photos: Photo[];
  isCompleted: boolean;
}
