import React from 'react';
import { CommercialProperty } from '../services/PropertyService';
import Image from 'next/image';
import { generatePropertyUrl } from '../utils/Utils';
import { useRouter } from 'next/navigation';

interface  CommercialPropertyCardProps {
    property: CommercialProperty;
    onClick: () => void;
}

// Define the component without React.memo() first
const CommercialPropertyCard: React.FC<CommercialPropertyCardProps> = ({ property, onClick }) => {

    const router = useRouter();
    const propertyUrl = generatePropertyUrl(property);
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

        const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            router.push(propertyUrl); // Use Next.js router instead of window.location
            if (onClick) onClick(); // Still call the onClick prop if provided
        };

    return (

     <>
     {/* Cover Image */}
     <div className= "max-w-md bg-white rounded-md shadow-md overflow-hidden border border-gray-200" onClick={handleClick}>
        <div className= "h-48 bg-gray-300 flex items-center justify-center">
            <Image width={800} height={400} src ={coverImage} alt={property.name} className="w-full h-full object-cover"></Image>
        </div>
        {/* Property Details */}
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{property.name}</h2>
            <p className="text-gray-600 mb-2">{property.locality}</p>
            <div className="flex flex-col space-y-6">
                <div className="flex flex-wrap gap-2 justify-between mb-4">

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
)};

CommercialPropertyCard.displayName = 'CommercialPropertyCard';

// Export the component wrapped with React.memo() only once
export default React.memo(CommercialPropertyCard, (prevProps, nextProps) => {
    return prevProps.property.airtable_id === nextProps.property.airtable_id;
});
