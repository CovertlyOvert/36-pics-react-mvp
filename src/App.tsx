
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NewTrip from "./pages/NewTrip";
import CameraScreen from "./pages/CameraScreen";
import GalleryScreen from "./pages/GalleryScreen";
import NotFound from "./pages/NotFound";
import { PhotoProvider } from "./context/PhotoContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PhotoProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/new-trip" element={<NewTrip />} />
            <Route path="/camera/:tripId" element={<CameraScreen />} />
            <Route path="/gallery/:tripId" element={<GalleryScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PhotoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
