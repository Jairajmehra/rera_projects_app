

'use client';

import { useState } from 'react';
import {Filters as FiltersType} from '../app/map/page';
import useLocalities from '../hooks/useLocalities';
import Filter from './Filters';
import LocationSearch from './LocationSearch';
import useViewport from '../utils/useViewport';


interface NavbarProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

export default function Navbar({ filters, onFiltersChange }: NavbarProps) {

  const {data: allLocalities = [], isLoading} = useLocalities();
  const isMobile = useViewport(768);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isLocationSearchOpen, setIsLocationSearchOpen] = useState(false);

  const handleLocalityChange = (newLocalities: string[]) => {
    onFiltersChange({...filters, locations: newLocalities});
  };

  if (isLoading) return <div className="navbar-loading">Loading localities...</div>;

  if (isMobile) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-content">
            {/* Location Button */}
            <div className="location-search-container">
              <button
                className="navbar-location-button"
                onClick={() => setIsLocationSearchOpen(true)}
              >
                <div className="navbar-location-button-content">

                  <span>
                    {filters.locations.length
                      ? `${filters.locations.length} locations selected`
                      : 'Search locations...'}
                  </span>
                  {filters.locations.length > 0 && (
                    <svg
                      className="clear-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFiltersChange({ ...filters, locations: [] });
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
              </button>
            </div>
  
            {/* Mobile Filter Button */}
            <div className="mobile-filter-button-container">
              <button
                className="mobile-filter-button"
                onClick={() => setIsFilterDrawerOpen(true)}
                aria-label="Open filters"
              >
                <svg className="filter-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
          </div>
  
          {/* Filter Drawer for Mobile */}
          {isFilterDrawerOpen && (
            <Filter
              isOpen={isFilterDrawerOpen}
              onClose={() => setIsFilterDrawerOpen(false)}
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
          )}
  
          {/* Location Search Modal */}
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
        </nav>
      </>
    );
  }
  return (
    <>
      <nav className="navbar">
        <div className="filters-inline">
          <div className="location-search-container">
            <button
              className="navbar-location-button"
              onClick={() => setIsLocationSearchOpen(true)}
            >
              <div className="navbar-location-button-content">

                <span>
                  {filters.locations.length
                    ? `${filters.locations.length} locations selected`
                    : 'Search locations...'}
                </span>
                {filters.locations.length > 0 && (
                  <svg
                    className="clear-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFiltersChange({ ...filters, locations: [] });
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
          
          <div className="filter-section">
            <Filter
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
          </div>
        </div>

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
      </nav>
    </>
  );
};