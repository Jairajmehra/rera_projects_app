import React from 'react';
import { ResidentialProperty } from '../services/residentialPropertyService';


interface ResidentialPropertyCardProps {
    property: ResidentialProperty;
    onClick: () => void;
}

const ResidentialPropertyCard: React.FC<ResidentialPropertyCardProps> = ({ property, onClick }) => {
    return (
        <div onClick={onClick} className="flex gap-4 p-4 shadow rounded cursor-pointer hover:shadow-md transition">
             {property.photos ? (
                <img 
                    src={property.photos[0]} 
                    alt={property.name} 
                    className="w-24 h-24 object-cover rounded" 
                />
            ) : (
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                </div>
            )}
        <div className="flex flex-col justify-between">
          <h3 className="text-lg font-semibold">{property.name}</h3>
          <h3 className="text-lg font-semibold">{property.bhk}</h3>
          <p className="text-sm text-gray-600">{property.locality}</p>
          <div className="text-md font-bold">{property.price}</div>
          <div className="text-sm text-gray-600">{property.propertyType}</div>
        </div>
      </div>
        
    )
}

export default ResidentialPropertyCard;