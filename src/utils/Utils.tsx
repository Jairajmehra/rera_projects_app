


export const parseCoordinates = (coordinateString: string): { lat: number; lng: number } => 
    {
        const [lat, lng] = coordinateString.split(',').map(Number);
        return { lat, lng };
    };


        // Utility function to get the extended bounds
export const getExtendedBounds = (bounds: google.maps.LatLngBounds, extensionPercentage: number): google.maps.LatLngBounds => {
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