'use client';

import { useState } from 'react';
import { Filters } from '../app/map/page';
import useLocalities from '../hooks/useLocalities';
import FilterDrawer from './FilterDrawer';
import LocationSearch from './LocationSearch';
import useViewport from './useViewport';

interface NavbarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function Navbar({ filters, onFiltersChange }: NavbarProps) {
  
  const { data: allLocalities = [], isLoading } = useLocalities();
  const isMobile = useViewport(768);
  const availableBHKs = ['BHK 1', 'BHK 2', 'BHK 3', 'BHK 4'];
  const availableProjectTypes = ['Residential', 'Commercial'];
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isLocationSearchOpen, setIsLocationSearchOpen] = useState(false);

  const handleLocalityChange = (newLocalities: string[]) => {
    onFiltersChange({
      ...filters,
      locations: newLocalities
    });
  };

  if (isLoading) return <div>Loading localities...</div>;

  

    return (
      <>
        <nav className="relative z-50 bg-white shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Location Search Button */}
            <button
              onClick={() => setIsLocationSearchOpen(true)}
              className="flex-1 text-left p-2 border rounded-lg text-gray-500"
            >
              {filters.locations.length 
                ? `${filters.locations.length} locations selected`
                : 'Search locations...'}
            </button>
    
            {/* Filter Icon (Mobile Only) */}
            {isMobile && (
              <button 
                onClick={() => setIsFilterDrawerOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
                aria-label="Open filters"
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="text-gray-700"
                >
                  <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
                </svg>
              </button>
            )}
    
            {/* Desktop Filters */}
            {!isMobile && (
              <div className="flex gap-4">
                {/* Your existing desktop filters */}
              </div>
            )}
          </div>
        </nav>
    
        {/* Add these components */}
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          filters={filters}
          onFiltersChange={onFiltersChange}
        />
    
        {isLocationSearchOpen && (
          <LocationSearch
            localities={allLocalities}
            selectedLocalities={filters.locations}
            onSelect={(locations) => {
              onFiltersChange({ ...filters, locations });
              setIsLocationSearchOpen(false);
            }}
            onClose={() => setIsLocationSearchOpen(false)}
          />
        )}
      </>
    );
}