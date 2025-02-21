import React from 'react';
import '../css/Filters.css';
import {Filters as FiltersType} from '../app/map/page';
import useViewport from '../utils/useViewport';
import '../css/Filters.css';
import {availableBHKs} from '../utils/filterOptions';

interface FiltersProps {
    isOpen?: boolean;
    onClose?: () => void;
    filters: FiltersType;
    onFiltersChange: (filters: FiltersType) => void;
}


const Filter: React.FC<FiltersProps> = ({isOpen=false, onClose = () => {}, filters, onFiltersChange}) => {


    const isMobile = useViewport(768);

    const handleBhkChange = (bhk: string) => {
        const bhks = filters.bhks.includes(bhk)
        ? filters.bhks.filter((v) => v !== bhk)
        : [...filters.bhks, bhk];
        onFiltersChange({...filters, bhks:bhks});
    };
    
    if (isMobile)
    {
        return (
            <>
              <div
                className={`filters-backdrop ${isOpen ? 'open' : ''}`}
                onClick={onClose}
              />
              <div className={`filters-drawer ${isOpen ? 'open' : ''}`}>
                <div className="filters-content">
                  <div className="filters-header">
                    <h2 className="filters-title">Filters</h2>
                    <button onClick={onClose} className="filters-close">
                      ✕
                    </button>
                  </div>
                  <div className="filter-section">
                    <h3 className="filter-section-title">BHK</h3>
                    <div className="filter-options">
                      {availableBHKs.map((bhk) => (
                        <label key={bhk} className="filter-option">
                          <input
                            type="checkbox"
                            checked={filters.bhks.includes(bhk)}
                            onChange={() => handleBhkChange(bhk)}
                          />
                          {bhk}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
    }
    return (
        <div className="filters-inline">
          <div className="filter-group">
            <label className="filter-label">BHK</label>
            <div className="filter-options">
              {availableBHKs.map((bhk) => (
                <label key={bhk} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.bhks.includes(bhk)}
                    onChange={() => handleBhkChange(bhk)}
                  />
                  {bhk}
                </label>
              ))}
            </div>
          </div>
        </div>
      );
};

export default Filter;
