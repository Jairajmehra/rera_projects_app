import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Components for properties
import ResidentialPopUpCard from "../ResidentialPopUpCard";
import useResidentialProperties from "../../hooks/useResidentialProperties";
import { ResidentialProperty } from "../../services/residentialPropertyService";

import debounce from 'lodash.debounce';
import MapDrawer from "../MapDrawer";
import { parseCoordinates, getExtendedBounds } from "../../utils/Utils";
import { Filters } from "../../app/map/page";

declare global {
    interface Window {
      google: typeof google;
    }}
  
interface MapContainerProps {
      filters: Filters;
      onFiltersChange: (filters: Filters) => void; // if needed
    }


const MapContainer: React.FC<MapContainerProps> = ({ filters, onFiltersChange }) => {

    // Add a Set to track unique markers by rera number
    const markerPositionsRef = useRef(new Set<string>());

    const mapRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  
    const [selectedProperty, setSelectedProperty] = useState<ResidentialProperty | null>(null);
    const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);


    // Utility function to close the pop up card
    const handleCloseCard = useCallback(() => {
        setSelectedProperty(null);
    }, []);

    function clearAllMarkers() {
        markersRef.current.forEach((marker) => (marker.map = null));
        markersRef.current = [];
        markerPositionsRef.current.clear();
      }

    /**
   * Remove markers that are outside the viewport extended by 20%.
   * Markers that lie outside the extended bounds are removed from the map.
   */
  const removeMarkersOutsideExtendedBounds = () => {
    
    if (!mapInstance) {
        console.log("mapInstance is not available");
        return;
    }
    const currentBounds = mapInstance.getBounds();
    if (!currentBounds){
        console.log("currentBounds is not available");
        return;
    } 
    // Extend viewport by 20% 
    const extensionPercentage = 0.2;
    const extendedBounds = getExtendedBounds(currentBounds, extensionPercentage);
    
    // Filter markers: remove the marker if it does not fall within extended bounds
    markersRef.current = markersRef.current.filter((marker) => {
      const markerPos = marker.position;
      if (!markerPos || !extendedBounds.contains(markerPos)) 
      {
        marker.map = null;
        markerPositionsRef.current.delete(marker.title);
        console.log('Marker removed:', marker.title);
        return false;
      }
      return true;
    });
  };

  // Fetch the projects from the API using our custom hook when the bounds change
    const { data, isLoading } = useResidentialProperties({page: 1, limit: 200, offset: 0,
        bounds: bounds? {
            north: bounds.getNorthEast().lat(),
            south: bounds.getSouthWest().lat(),
            east: bounds.getNorthEast().lng(),
            west: bounds.getSouthWest().lng(),
        } : undefined,
    });
    console.log('API Response:', data);

    // Utility function to set the new bounds waits for 500ms before setting the bounds
    const onBoundsChange = useCallback(debounce((map: google.maps.Map) => 
    {
        const newBounds = map.getBounds();
            if (newBounds) {
                console.log('Setting new bounds:', newBounds.toString());
                setBounds(newBounds);
    }}, 500), []);

    useEffect(() => {
        if (!window.google) 
        {
            console.log('Google is not available');
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker`;
            script.async = true;
            //script.defer = true;
            script.onload = () => 
            {
                initMap();
            };
            document.head.appendChild(script);
        }
        else
        {
            console.log('Google is available initializing map');
            initMap();
            return;
        }
    }, []);

    const initMap = () => 
    {
        console.log('Initializing map');
        if (!mapRef.current || !window.google){ 
            console.log('Map ref or window.google is not available');
            return;
        }
        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 23.022938, lng: 72.530304 },
            zoom: 12,
            mapId: '4357fd779b0d90cd',
            gestureHandling: 'greedy',
        });
        map.addListener('bounds_changed', () => {
            onBoundsChange(map);
        });
        setMapInstance(map);
        console.log('Map instance set', map);
    };


        useEffect(() => 
        {
            if (!mapInstance || !bounds) return;
            removeMarkersOutsideExtendedBounds();
        }, [mapInstance, bounds]);

        const uniqueProperties = useMemo(() => 
        {
            const uniqueMap = new Map<string, ResidentialProperty>();
            data?.properties?.forEach((property) => {
              uniqueMap.set(property.airtable_id, property);
            });
            return Array.from(uniqueMap.values());
          }, [data?.properties]);

          // Apply the filters to the unique projects.
        const filteredProperties = useMemo(() => {
            console.log('Filtering Properties with filters:', filters);
            console.log('Unique Properties:', uniqueProperties);
            return uniqueProperties.filter((property) => {
            let matches = true;
            if (filters.bhks.length) {
                // Assume property.bhk is a string or an array of strings.
                const propertyBHKs = Array.isArray(property.bhk) ? property.bhk : [property.bhk];
                matches = matches && propertyBHKs.some((bhk) => filters.bhks.includes(bhk));
            }
            if (filters.projectTypes.length) {
                const types = Array.isArray(property.propertyType) ? property.propertyType : [property.propertyType];
                matches = matches && types.some((type) => filters.projectTypes.includes(type));
            }
            if (filters.locations.length) {
                const locations = Array.isArray(property.locality) ? property.locality : [property.locality];
                matches = matches && locations.some((loc) => filters.locations.includes(loc));
            }
            console.log('Property matches filters:', property.name, property.bhk,matches);
            return matches;
            });
            }, [uniqueProperties, filters]);


            const validProperties = useMemo(() => {
              console.log('Validating properties:', filteredProperties);
              const invalid: string[] = [];
              return filteredProperties.filter(property => {
                  if (!property.coordinates){
                    invalid.push(`${property.name} ${property.coordinates} (${property.airtable_id}): No coordinates`);
                    return false;
                  } 
                  const coords = parseCoordinates(property.coordinates);
                  if (!coords || isNaN(coords.lat) || isNaN(coords.lng)){
                    invalid.push(`${property.name} ${property.coordinates} (${property.airtable_id}): Invalid coordinates`);
                    return false;
                  }
                  return true;
              });
          }, [filteredProperties]);

            useEffect(() => {
                if (!mapInstance) return;
                // Clear all existing markers.
                clearAllMarkers();
                // Add new markers for each filtered project.
                validProperties.forEach((property) => {
                  const markerId = property.airtable_id;
                  const { lat, lng } = parseCoordinates(property.coordinates);

                  if (markerPositionsRef.current.has(markerId)) return;

                  const marker = new window.google.maps.marker.AdvancedMarkerElement({
                    map: mapInstance,
                    position: { lat, lng },
                    title: property.airtable_id,
                  });
                  marker.addListener("click", () => {
                    console.log("Marker clicked:", property.airtable_id);
                    setSelectedProperty(property);
                  });
                  markersRef.current.push(marker);
                  markerPositionsRef.current.add(markerId);
                });
                console.log("Markers Count after adding:", markersRef.current.length);
              }, [filteredProperties, mapInstance]);
        

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          {isLoading && <div className="loading-overlay">Loading...</div>}
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

          {selectedProperty && (
            <ResidentialPopUpCard 
                property={selectedProperty} 
                onClose={handleCloseCard}
            />
          )}

          <MapDrawer 
            properties={filteredProperties || []} 
            filters={filters}
            onFiltersChange={onFiltersChange}
            onPropertySelect={(property) => setSelectedProperty(property)}
            />
        </div>
      );
}

export default MapContainer;
