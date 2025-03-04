import React, { useState, useEffect } from 'react';
import {availableBHKs} from '../utils/filterOptions';
import {ResidentialFilters, CommercialFilters} from '../services/filters';
import {FilterSearch} from './UniversalFilterComponent';
import useViewport from '../utils/useViewport';
import { propertyTypes } from '../utils/filterOptions';
import { transactionTypes } from '../utils/filterOptions';

// Union type for all property filters
type PropertyFilters = ResidentialFilters | CommercialFilters;

interface FiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  propertyType: 'residential' | 'commercial';
}

const FilterIcon = () => (
  <svg
    className="h-6 w-6 text-gray-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

// Type guard to check if we have residential filters
const isResidentialFilters = (filters: PropertyFilters): filters is ResidentialFilters => {
  return (filters as ResidentialFilters).bhks !== undefined;
};

export default function Filters({ filters, onFiltersChange, propertyType}: FiltersProps) 
{
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useViewport(768);
  const [isBHKFilterOpen, setIsBHKFilterOpen] = useState(false);
  const [isPropertyTypeFilterOpen, setIsPropertyTypeFilterOpen] = useState(false);
  const [isTransactionTypeFilterOpen, setIsTransactionTypeFilterOpen] = useState(false);
  
  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    if (isDrawerOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen]);

  // Handle BHK change - only for residential properties
  const handleBHKChange = (newBHKs: string[]) => {
    if (propertyType === 'residential') {
      if (isResidentialFilters(filters)) {
        onFiltersChange({...filters, bhks: newBHKs});
      } else {
        // Convert to residential filters if needed
        onFiltersChange({
          ...filters,
          type: 'residential',
          bhks: newBHKs
        } as ResidentialFilters);
      }
    }
  };

  // Handle Property Type change
  const handlePropertyTypeChange = (newPropertyTypes: string[]) => {
    if (propertyType === 'residential') {
      if (isResidentialFilters(filters)) {
        onFiltersChange({...filters, propertyType: newPropertyTypes});
      } else {
        // Convert to residential filters if needed
        onFiltersChange({
          ...filters,
          type: 'residential',
          bhks: [],
          propertyType: newPropertyTypes
        } as ResidentialFilters);
      }
    } else {
      // Commercial filters
      onFiltersChange({
        ...filters,
        type: 'commercial', 
        propertyType: newPropertyTypes
      } as CommercialFilters);
    }
  };

  // Handle Transaction Type change
  const handleTransactionTypeChange = (newTransactionTypes: string[]) => {
    if (propertyType === 'residential') {
      if (isResidentialFilters(filters)) {
        onFiltersChange({...filters, transactionType: newTransactionTypes});
      } else {
        // Convert to residential filters if needed
        onFiltersChange({
          ...filters,
          type: 'residential',
          bhks: [],
          transactionType: newTransactionTypes
        } as ResidentialFilters);
      }
    } else {
      // Commercial filters
      onFiltersChange({
        ...filters,
        type: 'commercial',
        transactionType: newTransactionTypes
      } as CommercialFilters);
    }
  };

  // Access BHKs for residential properties only
  const getBHKs = () => {
    if (propertyType === 'residential' && isResidentialFilters(filters)) {
      return filters.bhks;
    }
    return [];
  };

  if (isMobile) 
  {
    return (
      <>
        {/* Filter Icon to open drawer on mobile */}
        <button onClick={() => setIsDrawerOpen(true)} className="p-2" aria-label="Open filters">
          <FilterIcon />
        </button>

        {/* Filter Drawer */}
        {isDrawerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsDrawerOpen(false)}>
            <div 
              className={`fixed right-0 top-0 h-full w-64 bg-white p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              >
              <h2 className="text-lg font-bold mb-4 text-center text-gray-800">Filters</h2>
              <div className="space-y-6">
                {/* Show BHK filter only for residential properties */}
                {propertyType === 'residential' && (
                  <FilterSearch
                    label="BHK"
                    FilterOptions={availableBHKs}
                    selectedFilters={getBHKs()}
                    onSelect={handleBHKChange}
                    isOpen={isBHKFilterOpen}
                    setIsOpen={setIsBHKFilterOpen}
                  />
                )}
                <FilterSearch
                  label="Property Type"
                  FilterOptions={propertyTypes}
                  selectedFilters={filters.propertyType}
                  onSelect={handlePropertyTypeChange}
                  isOpen={isPropertyTypeFilterOpen}
                  setIsOpen={setIsPropertyTypeFilterOpen}
                />
                <FilterSearch
                  label="Rent/Sale"
                  FilterOptions={transactionTypes}
                  selectedFilters={filters.transactionType}
                  onSelect={handleTransactionTypeChange}
                  isOpen={isTransactionTypeFilterOpen}
                  setIsOpen={setIsTransactionTypeFilterOpen}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
    <div className="flex flex-row w-full space-x-6">
      {/* Show BHK filter only for residential properties */}
      {propertyType === 'residential' && (
        <div className="flex flex-row w-full">
          <FilterSearch
            label="BHK"
            FilterOptions={availableBHKs}
            selectedFilters={getBHKs()}
            onSelect={handleBHKChange}
            isOpen={isBHKFilterOpen}
            setIsOpen={setIsBHKFilterOpen}
          />
        </div>
      )}
      <div className="flex flex-row w-full">
        <FilterSearch
          label="Property Type"
          FilterOptions={propertyTypes}
          selectedFilters={filters.propertyType}
          onSelect={handlePropertyTypeChange}
          isOpen={isPropertyTypeFilterOpen}
          setIsOpen={setIsPropertyTypeFilterOpen}
        />
      </div>

      <div className="flex flex-row w-full">
      <FilterSearch
          label="Rent/Sale"
          FilterOptions={transactionTypes}
          selectedFilters={filters.transactionType}
          onSelect={handleTransactionTypeChange}
          isOpen={isTransactionTypeFilterOpen}
          setIsOpen={setIsTransactionTypeFilterOpen}
        />
      </div>
    </div>
    </>
  );
}