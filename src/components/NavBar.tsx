'use client';
import { useState } from 'react';
import {Filters as FiltersType} from '../app/map/page';
import useLocalities from '../hooks/useLocalities';
import { LocationSearch } from './LocationSearch';
import useViewport from '../utils/useViewport';
import Filters from './Filters';

interface NavbarProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

export default function Navbar({filters, onFiltersChange}: NavbarProps) {

  const {data: allLocalities = [], isLoading} = useLocalities();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isLocationSearchOpen, setIsLocationSearchOpen] = useState(false);

  const handleLocalityChange = (newLocalities: string[]) => {
    onFiltersChange({...filters, locations: newLocalities});
  };

  const isMobile = useViewport(768);

  // Mobile Navbar
  if (isMobile) {
    return (
      <nav className="w-full max-h-32 bg-white border-b border-gray-200 flex items-center justify-start p-4">
      <div className="w-full max-w-md flex justify-between">
      <LocationSearch
        localities={allLocalities}
        selectedLocalities={filters.locations}
        onSelect={handleLocalityChange}
        isOpen={isLocationSearchOpen}
        setIsOpen={setIsLocationSearchOpen}/>

        <Filters
        filters={filters}
        onFiltersChange={onFiltersChange}/>

    </div>
    </nav>
    )};



// Desktop Navbar
  return (

    <nav className="w-full max-h-32 bg-white border-b border-gray-200 flex items-center justify-start p-4">
      <div className="w-full max-w-md">
      <LocationSearch
        localities={allLocalities}
        selectedLocalities={filters.locations}
        onSelect={handleLocalityChange}
        isOpen={isLocationSearchOpen}
        setIsOpen={setIsLocationSearchOpen}/>

    </div>
    <div className="w-full max-w-md">
      <Filters
        filters={filters}
        onFiltersChange={onFiltersChange}/>

    </div>
    </nav>
  )

}