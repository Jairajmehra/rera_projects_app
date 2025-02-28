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

// Create a singleton script loader to avoid duplicate scripts
let googleMapsPromise: Promise<void> | null = null;

const loadGoogleMapsScript = (): Promise<void> => {
  if (!googleMapsPromise) {
    googleMapsPromise = new Promise<void>((resolve) => {
      // If Google Maps is already loaded, resolve immediately
      if (window.google) {
        resolve();
        return;
      }

      // Check if script is already in the document
      const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      if (existingScript) {
        // Script exists but may not be loaded yet
        const checkGoogleLoaded = setInterval(() => {
          if (window.google) {
            clearInterval(checkGoogleLoaded);
            resolve();
          }
        }, 100);
      } else {
        // Create and add the script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker`;
        script.async = true;
        script.defer = true;
        script.id = 'google-maps-script';
        
        script.onload = () => {
          console.log('Google Maps script loaded');
          resolve();
        };
        
        script.onerror = (error) => {
          console.error('Error loading Google Maps script:', error);
          googleMapsPromise = null; // Reset so we can try again
        };
        
        document.head.appendChild(script);
      }
    });
  }
  
  return googleMapsPromise;
};

declare global {
    interface Window {
      google: typeof google;
    }
}
  
interface MapContainerProps {
  filters: Filters;
  //onFiltersChange: (filters: Filters) => void; // if needed
}

const MapContainer: React.FC<MapContainerProps> = ({ filters }) => {
    // Add a Set to track unique markers by rera number
    const markerPositionsRef = useRef(new Set<string>());
    const prevFiltersRef = useRef(filters);
    const mapRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<ResidentialProperty | null>(null);
    const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [isMapInitialized, setIsMapInitialized] = useState(false);
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

    // Fetch the projects from the API using our custom hook when the bounds change
    const { data, isLoading } = useResidentialProperties({
        page: 1, 
        limit: 200, 
        offset: 0,
        bounds: bounds ? {
            north: bounds.getNorthEast().lat(),
            south: bounds.getSouthWest().lat(),
            east: bounds.getNorthEast().lng(),
            west: bounds.getSouthWest().lng(),
        } : undefined,
        filters: filters,
    });
    
    const debouncedBoundsChange = useMemo(
      () => 
        debounce((map: google.maps.Map) => {
          const newBounds = map.getBounds();
          if (newBounds) {
            setBounds(newBounds);
          }
        }, 500),
      []
    );
    
    const onBoundsChange = useCallback((map: google.maps.Map) => {
      debouncedBoundsChange(map);
    }, [debouncedBoundsChange]);

    // Initialize the map
    const initMap = useCallback(() => {
        console.log('Initializing map');
        if (!mapRef.current || !window.google) { 
            console.log('Map ref or window.google is not available');
            return;
        }
        
        // If map is already initialized, clean it up first
        if (mapInstance) {
            google.maps.event.clearInstanceListeners(mapInstance);
        }
        
        // Create a new map instance
        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 23.022938, lng: 72.530304 },
            zoom: 12,
            mapId: '4357fd779b0d90cd',
            gestureHandling: 'greedy',
        });
        
        // Add event listeners
        map.addListener('bounds_changed', () => {
            onBoundsChange(map);
        });
        
        // Update state
        setMapInstance(map);
        setIsMapInitialized(true);
        console.log('Map instance set', map);
    }, [onBoundsChange, mapInstance]);

    // Load Google Maps API and initialize map
    useEffect(() => {
        console.log('MapContainer mounted');
        
        // Load Google Maps script
        loadGoogleMapsScript()
            .then(() => {
                console.log('Google Maps loaded, initializing map');
                setMapLoaded(true);
                // Don't initialize map here, defer to the next effect
            })
            .catch(error => {
                console.error('Failed to load Google Maps:', error);
            });
            
        // Cleanup function
        return () => {
            console.log('MapContainer unmounting');
            if (mapInstance) {
                // Just clear listeners but don't destroy the map instance completely
                google.maps.event.clearInstanceListeners(mapInstance);
            }
        };
    }, [mapInstance]); // Add mapInstance as a dependency since it's used in the cleanup function

    // Initialize map after Google Maps is loaded and mapRef is available
    useEffect(() => {
        if (mapLoaded && mapRef.current && !isMapInitialized) {
            console.log('Map loaded and ref available, initializing map');
            initMap();
        }
    }, [mapLoaded, initMap, isMapInitialized]);

    // Handle filter changes and markers
    useEffect(() => {
        if (!mapInstance) return;
        
        // Clear all markers only if filters have changed
        if (prevFiltersRef.current !== filters) {
            clearAllMarkers();
            prevFiltersRef.current = filters;
        }
        
        // Ensure the map is visible
        if (mapRef.current) {
            // Force a resize event to ensure the map renders properly
            window.google.maps.event.trigger(mapInstance, 'resize');
        }
    }, [mapInstance, filters]);

    const uniqueProperties = useMemo(() => {
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
    }, [uniqueProperties]);

    // Add and manage markers
    useEffect(() => {
        if (!mapInstance) return;
        
        // Add new markers for each filtered project.
        validProperties.forEach((property) => {
            const markerId = property.airtable_id;
            if (!markerPositionsRef.current.has(markerId)) {
                const { lat, lng } = parseCoordinates(property.coordinates);
                const marker = new window.google.maps.marker.AdvancedMarkerElement({
                    map: mapInstance,
                    position: { lat, lng },
                    title: markerId,
                });
                marker.addListener("click", () => {
                    console.log("Marker clicked:", property.airtable_id);
                    setSelectedProperty(property);
                });

                markersRef.current.push(marker);
                markerPositionsRef.current.add(markerId);
            }
        });

        const currentBounds = mapInstance.getBounds();
        if (currentBounds) {
            const extendedBounds = getExtendedBounds(currentBounds, 0.2);
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
    }, [validProperties, mapInstance]);

    if (isMobile) {
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
                        {!mapLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <p className="text-lg font-medium text-gray-600">Loading map...</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Drawer container */}
                    <div className="w-full">
                        <MapDrawer 
                            properties={validProperties || []} 
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
                    {!mapLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <p className="text-lg font-medium text-gray-600">Loading map...</p>
                        </div>
                    )}
                </div>
                
                {/* Drawer container */}
                <div className="w-[55%] h-full">
                    <MapDrawer 
                        properties={validProperties || []} 
                        onPropertySelect={(property) => setSelectedProperty(property)}
                    />
                </div>
            </div>
        </div>
    );
};

export default MapContainer;
