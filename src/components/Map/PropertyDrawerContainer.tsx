// projects-app/src/components/Map/PropertyDrawerContainer.tsx

import React from 'react';
import MapDrawer from '../MapDrawer';
// In the future: import CommercialMapDrawer from '../CommercialMapDrawer';
import { ResidentialProperty, CommercialProperty } from '../../services/PropertyService';

// Define a union type for properties
type Property = ResidentialProperty | CommercialProperty;

interface PropertyDrawerContainerProps {
  properties: Property[];
  propertyType: 'residential' | 'commercial';
  onPropertySelect: (property: Property) => void;
}

const PropertyDrawerContainer: React.FC<PropertyDrawerContainerProps> = ({
  properties, 
  propertyType, 
  onPropertySelect 
}) => {
  return (
    <MapDrawer 
      properties={properties} 
      propertyType={propertyType}
      onPropertySelect={onPropertySelect}
    />
  );
};

export default PropertyDrawerContainer;