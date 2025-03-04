// projects-app/src/components/Map/PropertyCardContainer.tsx

import React from 'react';
import { ResidentialProperty, CommercialProperty } from '../../services/PropertyService';
import ResidentialPopUpCard from '../ResidentialPopUpCard';
import CommercialPopUpCard from '../CommercialPopUpCard';

// Define a union type for properties
type Property = ResidentialProperty | CommercialProperty;

interface PropertyCardContainerProps {
  selectedProperty: Property | null;
  propertyType: 'residential' | 'commercial';
  onCloseCard: () => void;
}

const PropertyCardContainer: React.FC<PropertyCardContainerProps> = ({ 
  selectedProperty, 
  propertyType,
  onCloseCard 
}) => {
  if (!selectedProperty) return null;

  return (
    <>
      {propertyType === 'residential' ? (
        <ResidentialPopUpCard 
          property={selectedProperty as ResidentialProperty} 
          onClose={onCloseCard}
        />
      ) : (
        <CommercialPopUpCard 
          property={selectedProperty as CommercialProperty} 
          onClose={onCloseCard}
        />
      )}
    </>
  );
};

export default PropertyCardContainer;