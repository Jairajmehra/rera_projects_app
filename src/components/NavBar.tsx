'use client';
import { useState, useEffect } from 'react';
import useLocalities from '../hooks/useLocalities';
import { LocationSearch } from './LocationSearch';
import useViewport from '../utils/useViewport';
import Filters from './Filters';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ResidentialFilters, CommercialFilters } from '../services/filters';

// Union type for all property filters
type PropertyFilters = ResidentialFilters | CommercialFilters;

interface NavbarProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  // Optional property type prop - if not provided, will determine from path
  propertyType?: 'residential' | 'commercial';
}

export default function Navbar({filters, onFiltersChange, propertyType}: NavbarProps) {
  const {data: allLocalities = []} = useLocalities();
  const [isLocationSearchOpen, setIsLocationSearchOpen] = useState(false);
  const pathname = usePathname();
  
  // Determine property type either from props or path
  const getPropertyType = (): 'residential' | 'commercial' => {
    // If explicitly provided, use that
    if (propertyType) return propertyType;
    
    // Otherwise determine from path
    const isCommercialPath = pathname?.includes('/commercial');
    return isCommercialPath ? 'commercial' : 'residential';
  };

  const currentPropertyType = getPropertyType();
  
  // For UI highlighting - which tab is active
  const isResidential = currentPropertyType === 'residential';
  const isCommercial = currentPropertyType === 'commercial';

  // Type guard to check if we have residential filters
  const isResidentialFilters = (filters: PropertyFilters): filters is ResidentialFilters => {
    return (filters as ResidentialFilters).bhks !== undefined;
  };

  const handleLocalityChange = (newLocalities: string[]) => {
    if (currentPropertyType === 'residential') {
      if (isResidentialFilters(filters)) {
        // We have residential filters
        onFiltersChange({
          ...filters,
          locations: newLocalities
        });
      } else {
        // We need to convert to residential filters
        onFiltersChange({
          ...filters,
          type: 'residential',
          bhks: [],
          locations: newLocalities
        } as ResidentialFilters);
      }
    } else {
      // Commercial filters
      onFiltersChange({
        ...filters,
        type: 'commercial',
        locations: newLocalities
      } as CommercialFilters);
    }
  };

  const isMobile = useViewport(768);

  // Mobile Navbar
  if (isMobile) {
    return (
      <nav className="w-full bg-white border-b border-gray-200 flex flex-col p-4 gap-4">
        {/* Location Search - Top */}
        <div className="w-full">
          <LocationSearch
            localities={allLocalities}
            selectedLocalities={filters.locations}
            onSelect={handleLocalityChange}
            isOpen={isLocationSearchOpen}
            setIsOpen={setIsLocationSearchOpen}/>
        </div>
        
        {/* Second Row - Property Type Buttons and Filter */}
        <div className="w-full flex justify-between items-center">
          <div className="flex">
            <Link href="/commercial" 
              className={`px-6 py-2 text-lg ${
                isCommercial ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
              Commercial
            </Link>
            <Link href="/residential" 
              className={`px-6 py-2 text-lg ${
                isResidential ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
              Residential
            </Link>
          </div>
          
          <div>
            <Filters
              filters={filters}
              onFiltersChange={onFiltersChange}
              propertyType={currentPropertyType}/>
          </div>
        </div>
      </nav>
    );
  }

  // Desktop Navbar
  return (
    <nav className="w-full bg-white border-b border-gray-200 flex flex-col">
      {/* Branding at top center */}
      <div className="w-full flex justify-center py-3">
        <h1 className="text-3xl font-bold">PropView</h1>
      </div>
      
      {/* Main navbar content */}
      <div className="w-full flex items-center px-4 pb-4">
        {/* Left Side - Property Type Buttons */}
        <div className="flex space-x-4 flex-none w-1/5">
          <Link href="/residential" 
            className={`py-2 px-6 border rounded-md text-lg font-medium transition-colors w-full text-center flex items-center justify-center ${
              isResidential ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}>
            Residential
          </Link>
          <Link href="/commercial" 
            className={`py-2 px-6 border rounded-md text-lg font-medium transition-colors w-full text-center flex items-center justify-center ${
              isCommercial ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}>
            Commercial
          </Link>
        </div>
        
        {/* Center - Location Search */}
        <div className="flex-none w-1/5 mx-4">
          <LocationSearch
            localities={allLocalities}
            selectedLocalities={filters.locations}
            onSelect={handleLocalityChange}
            isOpen={isLocationSearchOpen}
            setIsOpen={setIsLocationSearchOpen}/>
        </div>
        
        {/* Right Side - Filters */}
        <div className="flex-grow ml-4">
          <Filters
            filters={filters}
            onFiltersChange={onFiltersChange}
            propertyType={currentPropertyType}/>
        </div>
      </div>
    </nav>
  );
}