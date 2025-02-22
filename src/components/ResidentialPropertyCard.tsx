import React from 'react';
import { ResidentialProperty } from '../services/residentialPropertyService';

interface ResidentialPropertyCardProps {
    property: ResidentialProperty;
    onClick: () => void;
}

const ResidentialPropertyCard: React.FC<ResidentialPropertyCardProps> = ({ property, onClick }) => {

    return (

     <>
     {/* Cover Image */}
     <div className= "max-w-md bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
        <div className= "h-48 bg-gray-300 flex items-center justify-center">
            <img src ={property.photos[0]} alt={property.name} className="w-full h-full object-cover"></img>
        </div>
        {/* Property Details */}
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{property.name}</h2>
            <p className="text-gray-600 mb-4">property.location</p>
            <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {property.bhk}
                    </span>
                    <button className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold"> 
                        {property.propertyType}
                    </button>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-lg font-semibold text-gray-800">₹{property.price}</p>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
                        "Under Construction"
                    </button>
                </div>
            </div>
        </div>
    </div>

    </>
    )};

export default ResidentialPropertyCard;