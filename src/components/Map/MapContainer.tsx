import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useResidentialProjects from "../../hooks/useResidentialProjects";
import { ResidentialProject } from "../../services/residentialProjectService";
import debounce from 'lodash.debounce';
import ResidentialPopUpCard from "../ResidentialPopUpCard";
import MapDrawer from "../MapDrawer";

declare global {
    interface Window {
      google: typeof google;
    }
  }
  

const MapContainer: React.FC = () => {

    // utility function parse coordinates
    // utils/mapUtils.ts
    const parseCoordinates = (coordinateString: string): { lat: number; lng: number } => 
    {
        const [lat, lng] = coordinateString.split(',').map(Number);
        return { lat, lng };
    };
  
    // Add a Set to track unique markers by some identifier (like project ID or coordinates)
    const [selectedProject, setSelectedProject] = useState<ResidentialProject | null>(null);
    const markerPositionsRef = useRef(new Set<string>());
    const mapRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

    const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

    const handleCloseCard = useCallback(() => {
        setSelectedProject(null);
    }, []);

    const getExtendedBounds = (bounds: google.maps.LatLngBounds, extensionPercentage: number): google.maps.LatLngBounds => {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        const latDiff = ne.lat() - sw.lat();
        const lngDiff = ne.lng() - sw.lng();
        const extendedSw = new window.google.maps.LatLng(
          sw.lat() - latDiff * extensionPercentage,
          sw.lng() - lngDiff * extensionPercentage
        );
        const extendedNe = new window.google.maps.LatLng(
          ne.lat() + latDiff * extensionPercentage,
          ne.lng() + lngDiff * extensionPercentage
        );
        return new window.google.maps.LatLngBounds(extendedSw, extendedNe);
      };

       /**
   * Remove markers that are outside the viewport extended by 10%.
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
    // Extend viewport by 10% (adjust this extension as needed)
    const extensionPercentage = 0.2;
    const extendedBounds = getExtendedBounds(currentBounds, extensionPercentage);
    
    // Filter markers: remove the marker if it does not fall within extended bounds
    markersRef.current = markersRef.current.filter((marker) => {
      const markerPos = marker.position;
      console.log('markerPos:', markerPos);
      if (!markerPos || !extendedBounds.contains(markerPos)) 
      {
        marker.remove();
        markerPositionsRef.current.delete(marker.title);
        return false;
      }
      return true;
    });
  };

    const { data, isLoading, error } = useResidentialProjects({page: 1, limit: 200, offset: 0,
        bounds: bounds? {
            north: bounds.getNorthEast().lat(),
            south: bounds.getSouthWest().lat(),
            east: bounds.getNorthEast().lng(),
            west: bounds.getSouthWest().lng(),
        } : undefined,
    });

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
  

    const updateMarkers = () => {
        if (!mapInstance || !data?.projects) return;
        console.log('Current markers count:', markersRef.current.length);

        const currentBounds = mapInstance.getBounds();
        if (!currentBounds) return;
        // Compute the extended bounds (10% extension)
        const extensionPercentage = 0.2;
        const extendedBounds = getExtendedBounds(currentBounds, extensionPercentage);

        // add new markers
        data.projects.forEach((project: ResidentialProject) =>{
            const markerId = project.rera;
            const {lat, lng} = parseCoordinates(project.coordinates);
            if (markerPositionsRef.current.has(markerId)) return;
            
            const marker = new window.google.maps.marker.AdvancedMarkerElement({
                map: mapInstance,
                position: {lat, lng},
                title: project.rera,
            });
            // Add click listener to the marker
            marker.addListener("click", () => 
            {
                console.log("Marker clicked:", project.rera);
                setSelectedProject(project);
            });
            markersRef.current.push(marker);
            markerPositionsRef.current.add(markerId);
           
        })
    };

       // Update markers when data changes
       useEffect(() => 
        {
            updateMarkers();
        }, [data, mapInstance]);


        useEffect(() => {
            if (!mapInstance || !bounds) return;
            removeMarkersOutsideExtendedBounds();
          }, [mapInstance, bounds]);

          const uniqueProjects = useMemo(() => {
            const uniqueMap = new Map<string, ResidentialProject>();
            data?.projects?.forEach((project) => {
              uniqueMap.set(project.rera, project);
            });
            return Array.from(uniqueMap.values());
          }, [data?.projects]);

        

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
            projects={uniqueProjects || []} 
            onProjectSelect={(project) => setSelectedProject(project)}
            />
        </div>
      );
}

export default MapContainer;
