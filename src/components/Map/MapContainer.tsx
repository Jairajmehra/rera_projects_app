import React, { useState, useMemo } from "react";
import { MapProvider, useMap } from "../../contexts/MapContext";
import MapInitializer from "./MapInitializer";
import PropertyMarkers from "./PropertyMarkers";
import MapControls from "./MapControls";
import PropertyCardContainer from "./PropertyCardContainer";
import PropertyDrawerContainer from "./PropertyDrawerContainer";
import useResidentialProperties from "../../hooks/useResidentialProperties";
import useCommercialProperties from "../../hooks/useCommericlaProperties";
import useViewport from "../../utils/useViewport";
import { ResidentialProperty, CommercialProperty } from "../../services/PropertyService";
import { ResidentialFilters, CommercialFilters } from "../../services/filters";

// Define a union type for properties
type Property = ResidentialProperty | CommercialProperty;
// Union type for all property filters
type PropertyFilters = ResidentialFilters | CommercialFilters;

// Type guard to check if we have residential filters
const isResidentialFilters = (filters: PropertyFilters): filters is ResidentialFilters => {
  return (filters as ResidentialFilters).bhks !== undefined;
};

interface MapContainerProps {
    filters: PropertyFilters;
    propertyType: 'residential' | 'commercial';
}

const MapContainer: React.FC<MapContainerProps> = ({ filters, propertyType }) => {
 
    const {bounds, setSelectedPropertyId} = useMap();
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const isMobile = useViewport(768);

    // Get BHKs from residential filters
    const getBHKs = () => {
      if (propertyType === 'residential' && isResidentialFilters(filters)) {
        return filters.bhks;
      }
      return [];
    };

    // Fetch residential properties
    const { data: residentialData, isLoading: isResidentialLoading } = useResidentialProperties(
        propertyType === 'residential' ? {
            page: 1, limit: 200, offset: 0,
            bounds: bounds ? {
                north: bounds.getNorthEast().lat(),
                south: bounds.getSouthWest().lat(),
                east: bounds.getNorthEast().lng(),
                west: bounds.getSouthWest().lng(),
            } : undefined,
            bhks: getBHKs(),
            locality: filters.locations,
            propertyType: filters.propertyType,
            transactionType: filters.transactionType?.join(','),
            priceMin: filters.priceMin,
            priceMax: filters.priceMax,
        } : { page: 1, limit: 0 } // Minimal params when not used
    );

    // Fetch commercial properties
    const { data: commercialData, isLoading: isCommercialLoading } = useCommercialProperties(
        propertyType === 'commercial' ? {
            page: 1, limit: 200, offset: 0,
            bounds: bounds ? {
                north: bounds.getNorthEast().lat(),
                south: bounds.getSouthWest().lat(),
                east: bounds.getNorthEast().lng(),
                west: bounds.getSouthWest().lng(),
            } : undefined,
            locality: filters.locations,
            propertyType: filters.propertyType,
            transactionType: filters.transactionType?.join(','),
            priceMin: filters.priceMin,
            priceMax: filters.priceMax,
        } : { page: 1, limit: 0 } // Minimal params when not used
    );

    // Determine which data and loading state to use
    const data = propertyType === 'residential' ? residentialData : commercialData;
    const isLoading = propertyType === 'residential' ? isResidentialLoading : isCommercialLoading;

    const uniqueProperties = useMemo(() => {
        const uniqueMap = new Map<string, Property>();
        data?.properties?.forEach((property)=> {
            uniqueMap.set(property.airtable_id, property);
        });
        return Array.from(uniqueMap.values());
    }, [data?.properties]);

    // Handle property selection
    const handlePropertySelect = (property: Property) => {
        setSelectedProperty(property);
        setSelectedPropertyId(property.airtable_id);
    };

    // Handle closing the property card
    const handleCloseCard = () => {
        setSelectedProperty(null);
        setSelectedPropertyId(null);
    };

   // Mobile layout
   if (isMobile) {
    return (
      <div className="w-full h-full relative">
        <PropertyCardContainer 
          selectedProperty={selectedProperty} 
          propertyType={propertyType}
          onCloseCard={handleCloseCard} 
        />

        <div className="flex flex-col w-full h-full relative overflow-hidden">
          <div className="w-full h-full">
            <MapInitializer />
            <MapControls />
            <PropertyMarkers 
              properties={uniqueProperties} 
              propertyType={propertyType}
              onPropertySelect={handlePropertySelect} 
            />
          </div>
          
          <div className="w-full">
            <PropertyDrawerContainer 
              properties={uniqueProperties} 
              propertyType={propertyType}
              onPropertySelect={handlePropertySelect} 
            />
          </div>
        </div>
      </div>
    );
  } 

  // Desktop layout
  return (
    <div className="w-full h-full relative">
      {isLoading && <div className="loading-overlay">Loading...</div>}

      <PropertyCardContainer 
        selectedProperty={selectedProperty} 
        propertyType={propertyType}
        onCloseCard={handleCloseCard} 
      />

      <div className="flex flex-row w-full h-full relative overflow-hidden">
        <div className="w-[45%] h-full">
          <MapInitializer />
          <MapControls />
          <PropertyMarkers 
            properties={uniqueProperties} 
            propertyType={propertyType}
            onPropertySelect={handlePropertySelect} 
          />
        </div>
        
        <div className="w-[55%] h-full">
          <PropertyDrawerContainer 
            properties={uniqueProperties} 
            propertyType={propertyType}
            onPropertySelect={handlePropertySelect} 
          />
        </div>
      </div>
    </div>
  );

}

// Wrapper component with context provider
const MapContainerWrapper: React.FC<MapContainerProps> = (props) => {
    return (
      <MapProvider>
        <MapContainer {...props} />
      </MapProvider>
    );
  };

export default MapContainerWrapper;
