'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Filters } from '../app/map/page';

interface NavbarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function Navbar({ filters, onFiltersChange }: NavbarProps) {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const availableBHKs = ['BHK 1', 'BHK 2', 'BHK 3', 'BHK 4'];
  const availableProjectTypes = ['Residential', 'Commercial'];
  const availableLocations = ['Thaltej', 'Gota', 'Prahladnagar', 'Bopal', 'Satellite'];

  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="max-w-7xl mx-auto">
        {/* STEP 1: Remove brand or logo references */}
        {/* STEP 2: Render filters in navbar */}
        
        <div className="flex flex-wrap items-center">
          {/* BHK Filter */}
          <div className="mr-8">
            <span className="font-semibold">BHK: </span>
            {availableBHKs.map(bhk => (
              <label key={bhk} className="ml-2">
                <input
                  type="checkbox"
                  checked={filters.bhks.includes(bhk)}
                  onChange={() => {
                    const bhks = filters.bhks.includes(bhk)
                      ? filters.bhks.filter(v => v !== bhk)
                      : [...filters.bhks, bhk];
                    onFiltersChange({ ...filters, bhks });
                  }}
                />
                {" "}{bhk}
              </label>
            ))}
          </div>

          {/* Project Type Filter */}
          <div className="mr-8">
            <span className="font-semibold">Project Type: </span>
            {availableProjectTypes.map(pt => (
              <label key={pt} className="ml-2">
                <input
                  type="checkbox"
                  checked={filters.projectTypes.includes(pt)}
                  onChange={() => {
                    const projectTypes = filters.projectTypes.includes(pt)
                      ? filters.projectTypes.filter(v => v !== pt)
                      : [...filters.projectTypes, pt];
                    onFiltersChange({ ...filters, projectTypes });
                  }}
                />
                {" "}{pt}
              </label>
            ))}
          </div>

          {/* Location Filter */}
          <div>
            <span className="font-semibold">Location: </span>
            {availableLocations.map(loc => (
              <label key={loc} className="ml-2">
                <input
                  type="checkbox"
                  checked={filters.locations.includes(loc)}
                  onChange={() => {
                    const locations = filters.locations.includes(loc)
                      ? filters.locations.filter(v => v !== loc)
                      : [...filters.locations, loc];
                    onFiltersChange({ ...filters, locations });
                  }}
                />
                {" "}{loc}
              </label>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}