'use client';
import { useState, useEffect } from 'react';
import {ResidentialFilters as FiltersType} from '../services/filters';
import useLocalities from '../hooks/useLocalities';
import { LocationSearch } from './LocationSearch';
import useViewport from '../utils/useViewport';
import Filters from './Filters';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

export default function Navbar({filters, onFiltersChange}: NavbarProps) {
  const {data: allLocalities = []} = useLocalities();
  const [isLocationSearchOpen, setIsLocationSearchOpen] = useState(false);
  const pathname = usePathname();
  
  // Determine active tab based on current path
  const isResidential = pathname?.includes('/residential') || (!pathname?.includes('/commercial') && !pathname?.includes('/residential'));
  const isCommercial = pathname?.includes('/commercial');

  const handleLocalityChange = (newLocalities: string[]) => {
    onFiltersChange({...filters, locations: newLocalities});
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
              onFiltersChange={onFiltersChange}/>
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
            onFiltersChange={onFiltersChange}/>
        </div>
      </div>
    </nav>
  );
}