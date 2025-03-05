// projects-app/src/components/Map/MapControls.tsx

import React from 'react';
import { useMap } from '../../contexts/MapContext';

// No props needed for this component
type MapControlsProps = Record<string, never>;

const MapControls: React.FC<MapControlsProps> = () => {
  const { mapInstance } = useMap();

  // You can add methods to control the map (zoom, pan, etc.)
  const handleZoomIn = () => {
    if (mapInstance) {
      mapInstance.setZoom((mapInstance.getZoom() || 0) + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      mapInstance.setZoom((mapInstance.getZoom() || 0) - 1);
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 z-10">
      <button 
        onClick={handleZoomIn}
        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100"
      >
        +
      </button>
      <button 
        onClick={handleZoomOut}
        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100 mt-1"
      >
        -
      </button>
    </div>
  );
};

export default MapControls;