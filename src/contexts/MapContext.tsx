// projects-app/src/contexts/MapContext.tsx
import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { loadGoogleMapsScript } from '../utils/mapUtils';

interface MapContextType {
  mapInstance: google.maps.Map | null;
  mapLoaded: boolean;
  isMapInitialized: boolean;
  bounds: google.maps.LatLngBounds | null;
  setBounds: (bounds: google.maps.LatLngBounds | null) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  mapRef: React.RefObject<HTMLDivElement | null>;
}

const MapContext = createContext<MapContextType | null>(null);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

interface MapProviderProps {
  children: React.ReactNode;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

export const MapProvider: React.FC<MapProviderProps> = ({
  children,
  initialCenter = { lat: 23.022938, lng: 72.530304 },
  initialZoom = 12,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const debouncedBoundsChange = useCallback(
    debounce((map: google.maps.Map) => {
      const newBounds = map.getBounds();
      if (newBounds) {
        setBounds(newBounds);
      }
    }, 500),
    []
  );

  // Load Google Maps API
  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        setMapLoaded(true);
      })
      .catch(error => {
        console.error('Failed to load Google Maps:', error);
      });
  }, []);

  // Initialize map after Google Maps is loaded
  useEffect(() => {
    if (mapLoaded && mapRef.current && !isMapInitialized) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        mapId: '4357fd779b0d90cd',
        gestureHandling: 'greedy',
      });

      map.addListener('bounds_changed', () => {
        debouncedBoundsChange(map);
      });

      setMapInstance(map);
      setIsMapInitialized(true);
    }
  }, [mapLoaded, isMapInitialized, debouncedBoundsChange, initialCenter, initialZoom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstance) {
        google.maps.event.clearInstanceListeners(mapInstance);
      }
    };
  }, [mapInstance]);

  const value = {
    mapInstance,
    mapLoaded,
    isMapInitialized,
    bounds,
    setBounds,
    selectedPropertyId,
    setSelectedPropertyId,
    mapRef,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};