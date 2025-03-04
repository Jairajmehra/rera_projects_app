import React from 'react';
import { CommercialProperty } from '../services/PropertyService';
import useViewport from '../utils/useViewport';
import Image from 'next/image';

interface CommercialPopUpCardProps {
    property: CommercialProperty;
    onClose: () => void;
}

const CommercialPopUpCard: React.FC<CommercialPopUpCardProps> = ({property, onClose}) => {
    const isMobile = useViewport();
    let coverImage = Array.isArray(property.photos) ? property.photos[0] : property.photos;
    if (!coverImage)
    {
        coverImage = "/apartment.png";
    }
    if (isMobile) {
        return (
            <div className="flex flex-col absolute bottom-0 left-0 right-0 z-[9999] bg-white 
                          max-h-[85vh] overflow-y-auto rounded-t-2xl shadow-lg">
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 bg-gray-200 rounded-full p-2 z-10" 
                    aria-label="Close"
                >
                    x
                </button>
                <Image 
                    src={coverImage} 
                    alt={property.name} 
                    width={800}
                    height={400}
                    className="w-full h-[40vh] object-cover"
                />
                <div className="flex flex-col p-4 space-y-4">
                    <div className="flex flex-row justify-between items-center">
                        <h3 className="text-xl font-bold">{property.price}</h3>
                        <p className="text-sm text-gray-500">{property.propertyType}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-sm text-gray-500">{property.transactionType}</p>
                        <p className="text-sm text-gray-500">{property.condition}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="absolute bottom-8 left-0 z-[9999] bg-white shadow-lg rounded-lg p-4 
                       w-[400px] max-w-[90vw] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <button 
                onClick={() => {
                    onClose();
                }} 
                className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                aria-label="Close"
            >
                X
            </button>
            <div className="flex flex-col">
                <Image 
                    width={800}
                    height={400}
                    src={coverImage} 
                    alt={property.name} 
                    className="w-full h-48 object-cover mb-4"
                />
                <h3 className="text-lg font-bold">{property.price}</h3>
                <div className="flex justify-between mt-2">
                    <p className="text-sm text-gray-500">{property.propertyType}</p>
                </div>
                <div className="flex justify-between mt-2">
                    <p className="text-sm text-gray-500">{property.transactionType}</p>
                    <p className="text-sm text-gray-500">{property.condition}</p>
                </div>
            </div>
        </div>
    );
};

export default CommercialPopUpCard;