import React, { useState, useRef, useEffect, useCallback } from 'react';

interface LocationSearchProps {
  localities: string[];
  selectedLocalities: string[];
  onSelect: (localities: string[]) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const LocationSearch = ({localities, selectedLocalities, onSelect, isOpen, setIsOpen}: LocationSearchProps) => {

  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setIsOpen(false);
  }, [setIsOpen]); 
  
  // Add click outside handler
  useEffect(() => 
  {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        clearSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => 
    { 
      document.removeEventListener('mousedown', handleClickOutside);
    }; 
  }, [isOpen, clearSearch]);



  // Filter localities based on search term
  const filteredLocalities = localities.filter(locality =>
    locality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle locality selection
  const handleSelect = (locality: string) => {
    const newSelection = selectedLocalities.includes(locality)
      ? selectedLocalities.filter(l => l !== locality)
      : [...selectedLocalities, locality];
    onSelect(newSelection);
  };

  return (
    <div className="relative w-full max-w-md flex items-center md:items-start">
      <div className="w-full" ref={dropdownRef}>
        {/* Label */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search Location
        </label>

        {/* Dropdown Trigger */}
        <div
          className="relative w-full max-w-md md:max-w-sm flex overflow-x-auto border border-blue-500 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
  
          {/* Search input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={selectedLocalities.length > 0 ? `${selectedLocalities.length} locations selected` : "Search locations..."}
            className="w-full p-2 border-0 focus:ring-0 text-gray-800"
          />

          {/* Existing: Dropdown icon */}
          <span className="absolute right-3 top-[50%] transform -translate-y-1/2">
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>
{isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {searchTerm === '' ? (
              selectedLocalities.length === 0 ? (
                <div className="p-2 text-gray-500">No locations selected.</div>
              ) : (
                selectedLocalities.map((locality) => (
                  <div
                    key={locality}
                    className="p-2 cursor-pointer hover:bg-gray-100 bg-blue-100"
                    onClick={() => handleSelect(locality)}
                  >
                    <div className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      <span className="text-gray-800">{locality}</span>
                    </div>
                  </div>
                ))
              )
            ) : (
              filteredLocalities.length === 0 ? (
                <div className="p-2 text-gray-500">No locations found.</div>
              ) : (
                filteredLocalities.map((locality) => (
                  <div
                    key={locality}
                    className={`p-2 cursor-pointer hover:bg-gray-100 ${
                      selectedLocalities.includes(locality) ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => {handleSelect(locality); clearSearch();}}
                  >
                    <div className="flex items-center">
                      {selectedLocalities.includes(locality) && (
                        <span className="mr-2 text-green-500">✓</span>
                      )}
                      <span className="text-gray-800">{locality}</span>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

