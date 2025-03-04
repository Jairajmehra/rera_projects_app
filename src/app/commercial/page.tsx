'use client'
import { useState } from "react";
import MapContainer from "@/components/Map/MapContainer";
import Navbar from "@/components/NavBar";

// Define Filters interface if you haven't already:
export interface Filters {
    bhks: string[];
    propertyType: string[];
    locations: string[];
    transactionType: string[];
    priceMin: number;
    priceMax: number;
  }

const MapPage: React.FC = () => {
    // STEP 1: Create filters in MapPage
  const [filters, setFilters] = useState<Filters>({bhks: [], propertyType: [],locations: [], transactionType:[], priceMin: 0, priceMax: 0});

    return (

 
      <div className="mainpage">
      <div className="navbar">
          <Navbar filters={filters} onFiltersChange={setFilters} />
      </div>
      <div className="flex-1 relative">
          <MapContainer filters={filters} propertyType="commercial" />
      </div>
      </div>

    )
}


export default MapPage;




