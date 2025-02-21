import React, { useState } from 'react';

interface LocationSearchProps {
  localities: string[];
  selectedLocalities: string[];
  onSelect: (localities: string[]) => void;
  onClose: () => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  localities,
  selectedLocalities,
  onSelect,
  onClose
}) => {
  const [searchText, setSearchText] = useState('');
  
  const filteredLocalities = localities.filter(loc =>
    loc.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex items-center gap-2 p-4 border-b">
        <button onClick={onClose} className="p-2">
          ←
        </button>
        <input
          type="text"
          placeholder="Search localities..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          autoFocus
        />
      </div>
      
      <div className="overflow-auto h-[calc(100vh-80px)]">
        {filteredLocalities.map(locality => (
          <label 
            key={locality} 
            className="flex items-center gap-2 p-4 border-b"
          >
            <input
              type="checkbox"
              checked={selectedLocalities.includes(locality)}
              onChange={() => {
                const newSelection = selectedLocalities.includes(locality)
                  ? selectedLocalities.filter(l => l !== locality)
                  : [...selectedLocalities, locality];
                onSelect(newSelection);
              }}
            />
            {locality}
          </label>
        ))}
      </div>
    </div>
  );
};

export default LocationSearch;