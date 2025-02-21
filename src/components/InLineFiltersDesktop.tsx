import React from 'react';
import '../css/InLineFiltersDesktop.css';

interface Filters {
  bhks: string[];
  projectTypes: string[];
  locations: string[];
}

interface InlineFiltersDesktopProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const InlineFiltersDesktop: React.FC<InlineFiltersDesktopProps> = ({ filters, onFiltersChange }) => {
  const availableBHKs = ['BHK 1', 'BHK 2', 'BHK 3', 'BHK 4'];
  const availableProjectTypes = ['Residential', 'Commercial'];

  const handleBHKChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBHKs = Array.from(event.target.selectedOptions, option => option.value);
    onFiltersChange({ ...filters, bhks: selectedBHKs });
  };

  const handleProjectTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectTypes = Array.from(event.target.selectedOptions, option => option.value);
    onFiltersChange({ ...filters, projectTypes: selectedProjectTypes });
  };

  return (
    <div className="inline-filters-desktop">
      <div className="filter-group">
        <label htmlFor="bhk-filter">BHK</label>
        <select
          id="bhk-filter"
          multiple
          value={filters.bhks}
          onChange={handleBHKChange}
          className="filter-select"
        >
          {availableBHKs.map(bhk => (
            <option key={bhk} value={bhk}>{bhk}</option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="project-type-filter">Project Type</label>
        <select
          id="project-type-filter"
          multiple
          value={filters.projectTypes}
          onChange={handleProjectTypeChange}
          className="filter-select"
        >
          {availableProjectTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InlineFiltersDesktop;