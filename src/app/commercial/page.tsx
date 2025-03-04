'use client'
import { useState } from "react";
import MapContainer from "@/components/Map/MapContainer";
import Navbar from "@/components/NavBar";
import { CommercialFilters, ResidentialFilters } from "@/services/filters";

// Union type for all property filters
type PropertyFilters = ResidentialFilters | CommercialFilters;

const MapPage: React.FC = () => {
  // Initialize with commercial-specific filters
  const [filters, setFilters] = useState<CommercialFilters>({
    type: 'commercial',
    propertyType: [],
    locations: [], 
    transactionType: [], 
    priceMin: 0, 
    priceMax: 0
  });

  // Type-safe handler for filter changes
  const handleFiltersChange = (newFilters: PropertyFilters) => {
    // Ensure we're only setting CommercialFilters to our state
    if (newFilters.type === 'commercial') {
      setFilters(newFilters as CommercialFilters);
    }
  };

  return (
    <div className="mainpage">
      <div className="navbar">
        <Navbar 
          filters={filters} 
          onFiltersChange={handleFiltersChange}
          propertyType="commercial" 
        />
      </div>
      <div className="flex-1 relative">
        <MapContainer filters={filters} propertyType="commercial" />
      </div>
    </div>
  )
}

export default MapPage;




