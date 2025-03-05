import React, { useState } from 'react';
import ResidentialPropertyCard from './ResidentialPropertyCard';
import CommercialPropertyCard from './CommercialPropertyCard';
import useViewport from '../utils/useViewport';
import { ResidentialProperty, CommercialProperty } from '../services/PropertyService';

export type DrawerState = 'collapsed' | 'partial' | 'full';
type Property = ResidentialProperty | CommercialProperty;

interface MapDrawerProps {
    properties: Property[];
    onPropertySelect: (property: Property) => void;
    propertyType: 'residential' | 'commercial';
}

// Define the MapDrawer as a regular function component without generics
const MapDrawer: React.FC<MapDrawerProps> = ({ 
    properties, 
    onPropertySelect,
    propertyType 
}) => {
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
          'drawerOpen';
  
      return `${baseClasses} ${stateClass}`;
    };

    // Clearer control of when to show content
    const shouldShowContent = () => {
      if (!isMobile) return true;
      return drawerState !== 'collapsed';
    };

    // Render the appropriate property card based on propertyType
    const renderPropertyCard = (property: Property) => {
        if (propertyType === 'residential' && 'bhk' in property) {
            return (
                <ResidentialPropertyCard
                    key={property.airtable_id}
                    property={property as ResidentialProperty}
                    onClick={() => onPropertySelect(property)}
                />
            );
        } else {
            return (
                <CommercialPropertyCard
                    key={property.airtable_id}
                    property={property as CommercialProperty}
                    onClick={() => onPropertySelect(property)}
                />
            );
        }
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {properties.map((property) => renderPropertyCard(property))}
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