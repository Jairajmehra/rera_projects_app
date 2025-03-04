// projects-app/src/components/Map/MapInitializer.tsx

import React from 'react';
import { useMap } from '../../contexts/MapContext';

interface MapInitializerProps {
  className?: string;
}

const MapInitializer: React.FC<MapInitializerProps> = ({ className = "w-full h-full" }) => {
  const { mapRef, mapLoaded } = useMap();

  return (
    <div ref={mapRef} className={className}>
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-lg font-medium text-gray-600">Loading map...</p>
        </div>
      )}
    </div>
  );
};

export default MapInitializer;