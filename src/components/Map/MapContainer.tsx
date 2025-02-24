import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// Components for properties
import ResidentialPopUpCard from "../ResidentialPopUpCard";
import useResidentialProperties from "../../hooks/useResidentialProperties";
import { ResidentialProperty } from "../../services/residentialPropertyService";
import useViewport from "../../utils/useViewport";
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
    const isMobile = useViewport(768);

    // Utility function to close the pop up card
    const handleCloseCard = useCallback(() => {
        console.log('Closing card');
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
        return;
    }
    const currentBounds = mapInstance.getBounds();
    if (!currentBounds){
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
        filters: filters,
    });
    

    // Utility function to set the new bounds waits for 500ms before setting the bounds
    const onBoundsChange = useCallback(debounce((map: google.maps.Map) => 
    {
        const newBounds = map.getBounds();
            if (newBounds) {
                setBounds(newBounds);
    }}, 500), []);

    useEffect(() => {
        if (!window.google) 
        {
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

            const validProperties = useMemo(() => {
              console.log('Validating properties:', uniqueProperties);
              const invalid: string[] = [];
              return uniqueProperties.filter(property => {
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
          }, [uniqueProperties]);

            useEffect(() => {
                if (!mapInstance) return;
                // Clear all existing markers.
                clearAllMarkers();
                console.log('Filters:', filters);
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
              }, [validProperties, mapInstance, filters]);
        




if (isMobile) 
{
  return (
    <div className="w-full h-full relative">
      

      {selectedProperty && (
        <ResidentialPopUpCard 
          property={selectedProperty} 
          onClose={handleCloseCard}
        />
      )}

      {/* Parent container for map and drawer */}
      <div className="flex flex-col w-full h-full relative overflow-hidden">
        {/* Map container */}
        <div ref={mapRef} className="w-full h-full">
          {/* The map will render here */}
        </div>
        
        {/* Drawer container */}
        <div className="w-full">
          <MapDrawer 
            properties={validProperties || []} 
            filters={filters}
            onFiltersChange={onFiltersChange}
            onPropertySelect={(property) => setSelectedProperty(property)}
          />
        </div>
      </div>
    </div>
  );
} 
  return (
    <div className="w-full h-full relative">
      {isLoading && <div className="loading-overlay">Loading...</div>}

      {selectedProperty && (
        <ResidentialPopUpCard 
          property={selectedProperty}
          onClose={handleCloseCard}
        />
      )}

      {/* Parent container for map and drawer */}
      <div className="flex flex-row w-full h-full relative overflow-hidden">
        {/* Map container */}
        <div ref={mapRef} className="w-[45%] h-full">
          {/* The map will render here */}
        </div>
        
        {/* Drawer container */}
        <div className="w-[55%] h-full">
          <MapDrawer 
            properties={validProperties || []} 
            filters={filters}
            onFiltersChange={onFiltersChange}
            onPropertySelect={(property) => setSelectedProperty(property)}
          />
        </div>
      </div>
    </div>
  );


};

export default MapContainer;
