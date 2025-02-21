import React from 'react';
import { Filters } from '../app/map/page';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange 
}) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 bottom-0 w-[80%] max-w-[400px] bg-white 
          shadow-xl z-50 transition-transform duration-300 transform 
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button onClick={onClose} className="p-2">✕</button>
          </div>
          
          {/* BHK Filter */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">BHK</h3>
            <div className="flex flex-wrap gap-2">
              {['BHK 1', 'BHK 2', 'BHK 3', 'BHK 4'].map(bhk => (
                <label key={bhk} className="flex items-center gap-2">
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
                  {bhk}
                </label>
              ))}
            </div>
          </div>

          {/* Project Type Filter */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Project Type</h3>
            <div className="flex flex-wrap gap-2">
              {['Residential', 'Commercial'].map(type => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.projectTypes.includes(type)}
                    onChange={() => {
                      const projectTypes = filters.projectTypes.includes(type)
                        ? filters.projectTypes.filter(v => v !== type)
                        : [...filters.projectTypes, type];
                      onFiltersChange({ ...filters, projectTypes });
                    }}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;