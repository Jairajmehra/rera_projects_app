// projects-app/src/components/Map/PropertyMarkers.tsx
import React, { useEffect, useRef, useMemo } from 'react';
import { useMap } from '../../contexts/MapContext';
import { parseCoordinates, getExtendedBounds } from '../../utils/Utils';
import { ResidentialProperty, CommercialProperty } from '../../services/PropertyService';
import {createCustomMarkerWithTailwind, createCustomMarkerContent} from '../../utils/customMarkerUtils';

// Define a union type for properties
type Property = ResidentialProperty | CommercialProperty;

interface PropertyMarkersProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
  propertyType: 'residential' | 'commercial';
}

const PropertyMarkers: React.FC<PropertyMarkersProps> = ({ 
  properties, 
  onPropertySelect,
  propertyType
}) => {
  const { mapInstance, bounds } = useMap();
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const markerPositionsRef = useRef(new Set<string>());

  // Filter valid properties with coordinates
  const validProperties = useMemo(() => {
    const invalid: string[] = [];
    return properties.filter(property => {
      if (!property.coordinates) {
        invalid.push(`${property.name} ${property.coordinates} (${property.airtable_id}): No coordinates`);
        return false;
      } 
      const coords = parseCoordinates(property.coordinates);
      if (!coords || isNaN(coords.lat) || isNaN(coords.lng)) {
        invalid.push(`${property.name} ${property.coordinates} (${property.airtable_id}): Invalid coordinates`);
        return false;
      }
      return true;
    });
  }, [properties]);

  function clearAllMarkers() {
    markersRef.current.forEach((marker) => (marker.map = null));
    markersRef.current = [];
    markerPositionsRef.current.clear();
  }

  // Add and manage markers
  useEffect(() => {
    if (!mapInstance) return;
    
    // Add new markers for each filtered property
    validProperties.forEach((property) => {
      const markerId = property.airtable_id;
      if (!markerPositionsRef.current.has(markerId)) {
        const { lat, lng } = parseCoordinates(property.coordinates);
        
        // // You could customize the marker style based on propertyType here
        // const marker = new window.google.maps.marker.AdvancedMarkerElement({
        //   map: mapInstance,
        //   position: { lat, lng },
        //   title: markerId,
        // });
               // Create different marker based on property type
               let marker: google.maps.marker.AdvancedMarkerElement;
        
               if (propertyType === 'residential') {
                 // Custom marker for residential properties
                 const content = createCustomMarkerWithTailwind(property as ResidentialProperty);
                 
                 marker = new window.google.maps.marker.AdvancedMarkerElement({
                   map: mapInstance,
                   position: { lat, lng },
                   title: markerId,
                   content
                 });
               } else {
                 // Default marker for commercial properties
                 marker = new window.google.maps.marker.AdvancedMarkerElement({
                   map: mapInstance,
                   position: { lat, lng },
                   title: markerId,
                 });
               }
        
        marker.addListener("click", () => {
          console.log(`${propertyType} marker clicked:`, property.airtable_id);
          onPropertySelect(property);
        });
        
        markersRef.current.push(marker);
        markerPositionsRef.current.add(markerId);
      }
    });

    // Clean up markers outside the extended bounds
    if (bounds) {
      const extendedBounds = getExtendedBounds(bounds, 0.2);
      markersRef.current = markersRef.current.filter((marker) => {
        const markerPos = marker.position;
        if (!markerPos || !extendedBounds.contains(markerPos)) {
          marker.map = null;
          markerPositionsRef.current.delete(marker.title!);
          return false;
        }
        return true;
      });
    }
    
    // Cleanup when component unmounts
    return () => {
      clearAllMarkers();
    };
  }, [validProperties, mapInstance, bounds, propertyType, onPropertySelect]);

  return null; // This is a logical component with no UI rendering
};

export default PropertyMarkers;