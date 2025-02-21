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
        // <div style={{ height: '100%', width: '100%', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        //     <Navbar filters={filters} onFiltersChange={setFilters}/>
        //     <div className="flex-1 relative">
        //         <MapContainer filters={filters} onFiltersChange={setFilters}/>
        //     </div>
        // </div>
      //   <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      //   {/* 2) Navbar at the top, possibly fixed if you like */}
      //   <Navbar filters={filters} onFiltersChange={setFilters} />
  
      //   {/* 3) The map content takes the remaining space */}
      //   <div style={{ flex: 1, position: 'relative' }}>
      //     <MapContainer filters={filters} onFiltersChange={setFilters} />
      //   </div>
      // </div>

 
      <div className="mainpage">
      <div className="navbar">
          <Navbar filters={filters} onFiltersChange={setFilters} />
      </div>
      <div className="flex-1 relative">
          <MapContainer filters={filters} onFiltersChange={setFilters} />
      </div>
      </div>

     


    )
}


export default MapPage;




