import React, {  useRef, useEffect } from 'react';

// Define the structure of a filter category
interface UniversalFilterProps {
    label: string;
    FilterOptions: string[];
    selectedFilters: string[];
    onSelect: (localities: string[]) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
  }



export const FilterSearch = ({label, FilterOptions, selectedFilters, onSelect, isOpen, setIsOpen}: UniversalFilterProps) => {

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);


  const handleSelect = (option: string) => {
    const newSelection = selectedFilters.includes(option)
      ? selectedFilters.filter(l => l !== option)
      : [...selectedFilters, option];
    onSelect(newSelection);
  };


  return (
    <div className="relative w-full max-w-sm flex items-center md:items-start">
      <div className="w-full" ref={dropdownRef}>
        {/* Label */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>

        {/* Dropdown Trigger */}
        <div
          className="relative w-full max-w-md md:max-w-sm flex border border-blue-500 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-10 items-center"
          onClick={() => setIsOpen(!isOpen)}>

            {selectedFilters.length > 0 ? (
              <p className="w-full p-2 border-0 focus:ring-0 text-gray-800">
                {selectedFilters.join(', ')}
              </p>
            ) : (
              <p className="w-full p-2 border-0 focus:ring-0 text-gray-800">
                {'Select ' + label}
              </p>
            )}

          <span className="absolute right-3 top-[50%] transform -translate-y-1/2">
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {FilterOptions.length === 0 ? (
              <div className="p-2 text-gray-500">No options found.</div>
            ) : (
              FilterOptions.map((option) => (
                <div
                  key={option}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    selectedFilters.includes(option) ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  <div className="flex items-center">
                    {selectedFilters.includes(option) && (
                      <span className="mr-2 text-green-500">✓</span>
                    )}
                    <span className="text-gray-800">{option}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};