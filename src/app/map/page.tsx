'use client'
import { useState } from "react";
import MapContainer from "@/components/Map/MapContainer";
import Navbar from "@/components/NavBar";

// Define Filters interface if you haven't already:
export interface Filters {
    bhks: string[];
    projectTypes: string[];
    locations: string[];
  }

const MapPage: React.FC = () => {
    // STEP 1: Create filters in MapPage
  const [filters, setFilters] = useState<Filters>({
    bhks: [],
    projectTypes: [],
    locations: []
  });

    return (
        <div style={{ height: '100%', width: '100%', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
            <Navbar filters={filters} onFiltersChange={setFilters}/>
            <MapContainer filters={filters} onFiltersChange={setFilters}/>
        </div>
    )
}


export default MapPage;


