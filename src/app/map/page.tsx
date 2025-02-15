'use client'
import MapContainer from "@/components/Map/MapContainer";
const MapPage: React.FC = () => {
    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <MapContainer />
        </div>
    )
}

// const Map: React.FC = () =>
// {
//     const center = {
//         lat: 37.7749, // Latitude for San Francisco
//         lng: -122.4194, // Longitude for San Francisco
//     }
//     const mapOptions = {
//         zoomControl: true,
//         scrollwheel: true,      // Enable scroll wheel zoom
//         disableDoubleClickZoom: false,
//         streetViewControl: true,
//         mapTypeControl: true,   // Show map/satellite toggle
//         fullscreenControl: true,
//         gestureHandling: "cooperative" // Changes zoom behavior
//     };
//     return(
//         <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
//             <GoogleMap mapContainerStyle={{ width: '100%', height: '100vh' }} center={center} zoom={13} options = {mapOptions} />
            

//         </LoadScript>
//     )
// }

export default MapPage;


