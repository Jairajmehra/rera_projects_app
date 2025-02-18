import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useResidentialProjects from "../../hooks/useResidentialProjects";
import { ResidentialProject } from "../../services/residentialProjectService";
import debounce from 'lodash.debounce';
import ResidentialPopUpCard from "../ResidentialPopUpCard";
import MapDrawer from "../MapDrawer";
import { parseCoordinates, getExtendedBounds } from "../../utils/Utils";


declare global {
    interface Window {
      google: typeof google;
    }}
  
  // Define our Filters interface.
export interface Filters {
    bhks: string[];
    projectTypes: string[];
    locations: string[];
  }

const MapContainer: React.FC = () => {

    // Add a Set to track unique markers by rera number
    const markerPositionsRef = useRef(new Set<string>());

    const mapRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  
    const [selectedProject, setSelectedProject] = useState<ResidentialProject | null>(null);
    const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

    // Add filter state (initially no filter is applied).
    const [filters, setFilters] = useState<Filters>({
        bhks: [],
        projectTypes: [],
        locations: []});

    // Utility function to close the pop up card
    const handleCloseCard = useCallback(() => {
        setSelectedProject(null);
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
    const { data, isLoading } = useResidentialProjects({page: 1, limit: 200, offset: 0,
        bounds: bounds? {
            north: bounds.getNorthEast().lat(),
            south: bounds.getSouthWest().lat(),
            east: bounds.getNorthEast().lng(),
            west: bounds.getSouthWest().lng(),
        } : undefined,
    });

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

        const uniqueProjects = useMemo(() => 
        {
            const uniqueMap = new Map<string, ResidentialProject>();
            data?.projects?.forEach((project) => {
              uniqueMap.set(project.rera, project);
            });
            return Array.from(uniqueMap.values());
          }, [data?.projects]);

          // Apply the filters to the unique projects.
        const filteredProjects = useMemo(() => {
            console.log('Filtering projects with filters:', filters);
            console.log('Unique projects:', uniqueProjects);
            return uniqueProjects.filter((project) => {
            let matches = true;
            if (filters.bhks.length) {
                // Assume project.bhk is a string or an array of strings.
                const projectBHKs = Array.isArray(project.bhk) ? project.bhk : [project.bhk];
                matches = matches && projectBHKs.some((bhk) => filters.bhks.includes(bhk));
            }
            if (filters.projectTypes.length) {
                const types = Array.isArray(project.projectType) ? project.projectType : [project.projectType];
                matches = matches && types.some((type) => filters.projectTypes.includes(type));
            }
            if (filters.locations.length) {
                const locations = Array.isArray(project.localityNames) ? project.localityNames : [project.localityNames];
                matches = matches && locations.some((loc) => filters.locations.includes(loc));
            }
            console.log('Project matches filters:', project.name, project.bhk,matches);
            return matches;
            });
            }, [uniqueProjects, filters]);

            useEffect(() => {
                if (!mapInstance) return;
                // Clear all existing markers.
                clearAllMarkers();
                // Add new markers for each filtered project.
                filteredProjects.forEach((project) => {
                  const markerId = project.rera;
                  const { lat, lng } = parseCoordinates(project.coordinates);

                  if (markerPositionsRef.current.has(markerId)) return;

                  const marker = new window.google.maps.marker.AdvancedMarkerElement({
                    map: mapInstance,
                    position: { lat, lng },
                    title: project.rera,
                  });
                  marker.addListener("click", () => {
                    console.log("Marker clicked:", project.rera);
                    setSelectedProject(project);
                  });
                  markersRef.current.push(marker);
                  markerPositionsRef.current.add(markerId);
                });
                console.log("Markers Count after adding:", markersRef.current.length);
              }, [filteredProjects, mapInstance]);
        

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          {isLoading && <div className="loading-overlay">Loading...</div>}
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

          {selectedProject && (
            <ResidentialPopUpCard 
                project={selectedProject} 
                onClose={handleCloseCard}
            />
          )}

          <MapDrawer 
            projects={filteredProjects || []} 
            filters={filters}
            onFiltersChange={setFilters}
            onProjectSelect={(project) => setSelectedProject(project)}
            />
        </div>
      );
}

export default MapContainer;
