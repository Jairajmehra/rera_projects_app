'use client'
import MapContainer from "@/components/Map/MapContainer";



const MapPage: React.FC = () => {
    return (
        <div style={{ height: '100%', width: '100%', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
            <MapContainer />
        </div>
    )
}


export default MapPage;


