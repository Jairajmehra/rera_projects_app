import React, { useState } from 'react';
import ResidentialPropertyCard from './ResidentialPropertyCard';
import useViewport from './useViewport';
import { Filters } from '../app/map/page';
import { ResidentialProperty } from '../services/residentialPropertyService';

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

      const drawerStyles = isMobile
      ? {
          height: drawerState === 'collapsed' ? '40px' 
                 : drawerState === 'partial' ? '40%' 
                 : '90%',
          transition: 'height 0.3s',
          width: '100%'
        }
      : {
          height: '100%',
          width: '400px',
          right: 0,
          top: 0
        };

    return (
        <div
          style={drawerStyles}
          className={`fixed bg-white shadow-lg overflow-hidden z-20 ${
            isMobile ? "bottom-0 left-0 right-0" : "top-0"
          }`}
        >
          {isMobile && (
            <div className="p-2 border-b cursor-pointer" onClick={toggleDrawerState}>
              <div className="w-12 h-1 bg-gray-400 rounded mx-auto"></div>
            </div>
          )}
    
          {/* Project list */}
          {(!isMobile || drawerState !== "collapsed") && (
            <div className="p-4 overflow-auto h-full">
              <div className="space-y-4">
                {properties.map((property) => (
                  <ResidentialPropertyCard
                    key={property.airtable_id}
                    property={property}
                    onClick={() => onPropertySelect(property)}
                  />
                ))}
                {properties.length === 0 && <div>No properties match these filters.</div>}
              </div>
            </div>
          )}
        </div>
      );
};

export default MapDrawer;