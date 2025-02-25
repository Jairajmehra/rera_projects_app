import React from 'react';
import { ResidentialProperty } from '../services/residentialPropertyService';
import Image from 'next/image';
interface ResidentialPropertyCardProps {
    property: ResidentialProperty;
    onClick: () => void;
}

const ResidentialPropertyCard: React.FC<ResidentialPropertyCardProps> = React.memo(({ property, onClick }) => {

    let coverImage = Array.isArray(property.photos) ? property.photos[0] : property.photos;
    if (!coverImage)
    {
        coverImage = "/apartment.png";
    }
    const formatIndianPrice = (price: number): string => {
        const removeTrailingZeros = (num: number) => 
            num.toFixed(2).replace(/\.?0+$/, '');

        if (price >= 10000000) { // ≥ 1 Crore
            return `${removeTrailingZeros(price / 10000000)}Cr`;
        } else if (price >= 100000) { // ≥ 1 Lakh
            return `${removeTrailingZeros(price / 100000)}L`;
        } else if (price >= 1000) { // ≥ 1 Thousand
            return `${removeTrailingZeros(price / 1000)}K`;
        }
        return price.toString();
    };
    const displayPrice = property.price 
        ? `₹${formatIndianPrice(property.price)}` 
        : "Available on Request";

    return (

     <>
     {/* Cover Image */}
     <div className= "max-w-md bg-white rounded-md shadow-md overflow-hidden border border-gray-200" onClick={onClick}>
        <div className= "h-48 bg-gray-300 flex items-center justify-center">
            <Image width={800} height={400} src ={coverImage} alt={property.name} className="w-full h-full object-cover"></Image>
        </div>
        {/* Property Details */}
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{property.name}</h2>
            <p className="text-gray-600 mb-2">{property.locality}</p>
            <div className="flex flex-col space-y-6">
                <div className="flex flex-wrap gap-2 justify-between mb-4">
       
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                            {property.bhk}
                        </span>

                        <button className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold"> 
                            {property.propertyType}
                        </button>
  
                </div>
                <div className="flex justify-between  items-center">
                    <p className="text-lg font-semibold text-gray-800">{displayPrice}</p>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium ">
                        Under Construction
                    </button>
                </div>
            </div>
        </div>
    </div>

    </>
)});

ResidentialPropertyCard.displayName = 'ResidentialPropertyCard';

export default React.memo(ResidentialPropertyCard, (prevProps, nextProps) => {
    return prevProps.property.airtable_id === nextProps.property.airtable_id;
});
//export default ResidentialPropertyCard;