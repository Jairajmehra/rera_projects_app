'use client'
import { useState } from "react";
import MapContainer from "@/components/Map/MapContainer";
import Navbar from "@/components/NavBar";
import { ResidentialFilters } from "@/services/filters";


const MapPage: React.FC = () => {
    // STEP 1: Create filters in MapPage
  const [filters, setFilters] = useState<ResidentialFilters>({bhks: [], propertyType: [],locations: [], transactionType:[], priceMin: 0, priceMax: 0});

    return (

 
      <div className="mainpage">
      <div className="navbar">
          <Navbar filters={filters} onFiltersChange={setFilters} />
      </div>
      <div className="flex-1 relative">
          <MapContainer filters={filters} propertyType="residential" />
      </div>
      </div>

    )
}


export default MapPage;




