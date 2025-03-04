'use client'
import { useState } from "react";
import MapContainer from "@/components/Map/MapContainer";
import Navbar from "@/components/NavBar";
import { ResidentialFilters, CommercialFilters } from "@/services/filters";

// Union type for all property filters
type PropertyFilters = ResidentialFilters | CommercialFilters;

const MapPage: React.FC = () => {
  // Initialize with residential-specific filters
  const [filters, setFilters] = useState<ResidentialFilters>({
    type: 'residential',
    bhks: [], 
    propertyType: [],
    locations: [], 
    transactionType: [], 
    priceMin: 0, 
    priceMax: 0
  });

  // Type-safe handler for filter changes
  const handleFiltersChange = (newFilters: PropertyFilters) => {
    // Ensure we're only setting ResidentialFilters to our state
    if (newFilters.type === 'residential') {
      setFilters(newFilters as ResidentialFilters);
    }
  };

  return (
    <div className="mainpage">
      <div className="navbar">
        <Navbar 
          filters={filters} 
          onFiltersChange={handleFiltersChange}
          propertyType="residential" 
        />
      </div>
      <div className="flex-1 relative">
        <MapContainer filters={filters} propertyType="residential" />
      </div>
    </div>
  )
}

export default MapPage;




