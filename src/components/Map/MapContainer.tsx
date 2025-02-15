import React, { useCallback, useEffect, useRef, useState } from "react";
import useResidentialProjects from "../../hooks/useResidentialProjects";
import { ResidentialProject } from "../../services/residentialProjectService";
import debounce from 'lodash.debounce';


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
    const markerPositionsRef = useRef(new Set<string>());
    const mapRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

    const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

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
        console.log('Debounce triggered with bounds:', map.getBounds()?.toString()); 
        const newBounds = map.getBounds();
            if (newBounds) {
                console.log('Setting new bounds:', newBounds.toString());
                setBounds(newBounds);
            }
    }, 500), []);


    useEffect(() => {
        if (!window.google) 
        {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                initMap();
            };
            document.head.appendChild(script);
        }
        else
        {
            initMap();
        }
    }, []);

    const initMap = () => {
        if (!mapRef.current || !window.google) return;

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 12.9716, lng: 77.5946 },
            zoom: 12,
            mapId: '4357fd779b0d90cd',
        });

        map.addListener('bounds_changed', () => {
            onBoundsChange(map);
        });

        setMapInstance(map);  
    };

    const updateMarkers = () => {
        if (!mapInstance || !data?.projects) return;
        console.log('Current markers count:', markersRef.current.length);

        // add new markers
        data.projects.forEach((project: ResidentialProject) =>{
            const markerId = project.rera;

            if (markerPositionsRef.current.has(markerId))
            {
                //console.log('Marker already exists for project:', project.name);
                return;
            }
            const {lat, lng} = parseCoordinates(project.coordinates);
            const marker = new window.google.maps.marker.AdvancedMarkerElement({
                map: mapInstance,
                position: {lat, lng},
                title: project.name,
            });
            markersRef.current.push(marker);
            markerPositionsRef.current.add(markerId);
           
        })
    };

       // Update markers when data changes
       useEffect(() => {
        updateMarkers();
    }, [data, mapInstance]);
    // useEffect(() => {

    //     if (window.google)
    //     {
    //         initMap();
    //     }

    // }, [data])

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}

export default MapContainer;
