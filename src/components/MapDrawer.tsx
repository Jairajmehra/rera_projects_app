import React, { useState } from 'react';
import ResidentialPropertyCard from './ResidentialPropertyCard';
import useViewport from './useViewport';
import { Filters } from '../app/map/page';
import { ResidentialProperty } from '../services/residentialPropertyService';
import { CSSProperties } from 'react';
export type DrawerState = 'collapsed' | 'partial' | 'full';

interface MapDrawerProps {
    properties: ResidentialProperty[];
    onPropertySelect: (property: ResidentialProperty) => void;
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
}

const MapDrawer: React.FC<MapDrawerProps> = ({ properties, onPropertySelect, filters, onFiltersChange }) => {

    const [drawerState, setDrawerState] = useState<DrawerState>('collapsed');
    const isMobile = useViewport();

    const toggleDrawerState = () => {
        // Cycle through states: collapsed -> partial -> full -> collapsed...
        if (isMobile) {
            setDrawerState(prev => {
                if (prev === 'collapsed') return 'partial';
                if (prev === 'partial') return 'full';
                return 'collapsed';
            });
        }
    };

    const getDrawerClassName = () => {
      if (!isMobile) {
          return 'h-full w-full bg-white shadow-lg';
      }
  
      const baseClasses = 'drawerMobile bg-white shadow-lg';
      const stateClass = 
          drawerState === 'collapsed' ? 'drawerClosed' :
          drawerState === 'partial' ? 'drawerPartial' : 
          'drawerOpen';  // Changed from 'drawerOpen' to 'drawerFull'
  
      return `${baseClasses} ${stateClass}`;
  };

  // NEW: Clearer control of when to show content
const shouldShowContent = () => {
  if (!isMobile) return true;
  return drawerState !== 'collapsed';
};

return (
  <div className={getDrawerClassName()}>
      {/* Mobile drawer handle */}
      {isMobile && (
          <div 
              className="h-10 flex items-center justify-center border-b cursor-pointer"
              onClick={toggleDrawerState}
          >
              <div className="w-12 h-1 bg-gray-400 rounded" />
          </div>
      )}

      {/* Drawer content */}
      {shouldShowContent() && (
                <div className="relative h-[calc(100%-2.5rem)]">
                    <div className="absolute inset-0 p-4 overflow-auto">
                        <div className="space-y-4">
                            {properties.map((property) => (
                                <ResidentialPropertyCard
                                    key={property.airtable_id}
                                    property={property}
                                    onClick={() => onPropertySelect(property)}
                                />
                            ))}
                            {properties.length === 0 && (
                                <div>No properties match these filters.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
  </div>
);



};

export default MapDrawer;