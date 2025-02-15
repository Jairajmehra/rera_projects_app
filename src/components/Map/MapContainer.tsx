import React, { useEffect, useRef } from "react";
import useResidentialProjects from "../../hooks/useResidentialProjects";
import { ResidentialProject } from "../../services/residentialProjectService";
import { useQuery } from "@tanstack/react-query";

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

    const { data, isLoading, error } = useResidentialProjects({page: 1, limit: 200, offset: 0});
    const mapRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

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
        if (data && data.projects){
            markersRef.current = data.projects.map((residentialProject: ResidentialProject) => {
                const {lat, lng} = parseCoordinates(residentialProject.coordinates);
                return new window.google.maps.marker.AdvancedMarkerElement({
                    map,
                    position: {lat, lng},
                    title: residentialProject.name,
                });
            });
        }
        
    };
    useEffect(() => {

        if (window.google)
        {
            initMap();
        }

    }, [data])

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}

export default MapContainer;
