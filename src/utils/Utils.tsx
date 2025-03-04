import { ResidentialProperty, CommercialProperty } from "../services/PropertyService";

// Define a union type for properties
type Property = ResidentialProperty | CommercialProperty;

export const parseCoordinates = (coordinateString: string): { lat: number; lng: number } => 
    {
        const [lat, lng] = coordinateString.split(',').map(Number);
        return { lat, lng };
    };


        // Utility function to get the extended bounds
export const getExtendedBounds = (bounds: google.maps.LatLngBounds, extensionPercentage: number): google.maps.LatLngBounds => {
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();
            const latDiff = ne.lat() - sw.lat();
            const lngDiff = ne.lng() - sw.lng();
            const extendedSw = new window.google.maps.LatLng(
              sw.lat() - latDiff * extensionPercentage,
              sw.lng() - lngDiff * extensionPercentage
            );
            const extendedNe = new window.google.maps.LatLng(
              ne.lat() + latDiff * extensionPercentage,
              ne.lng() + lngDiff * extensionPercentage
            );
            return new window.google.maps.LatLngBounds(extendedSw, extendedNe);
          };

          function slugify(value: string | undefined): string {
            if (!value || value.trim() === '') {
              return 'unknown';
            }
            return value
              .toLowerCase()
              .trim()
              .replace(/\//g, '-')      // Replace slashes with dashes
              .replace(/\s+/g, '-')     // Replace all spaces/tabs/newlines with a single dash
              .replace(/[^\w-]+/g, '')  // Remove any other weird characters (punctuation, etc.)
              .replace(/-+/g, '-');     // Collapse multiple dashes into one
          }
          export const generatePropertyUrl = (property: Property) => {
            // Helper to handle arrays or strings, with fallback for missing values
            const formatValue = (value: string | string[] | undefined): string => {
              if (!value) return "unknown";
              return Array.isArray(value) ? value[0] : value;
            };
          
            const city = slugify("Ahmedabad"); // or slugify(formatValue(property.city)) 
            const area = slugify(formatValue(property.locality));
            
            // Check if it's a residential property (has bhk property)
            if ('bhk' in property) {
              // Residential property URL
              const bhk = slugify(formatValue(property.bhk || "3-bhk"));
              const rawPropertyType = formatValue(property.propertyType);
              const propertyType = slugify(rawPropertyType);
              const transactionType = slugify(formatValue(property.transactionType));
              const rawName = property.name || "property"; // Default fallback
              const propertyNameSlug = slugify(rawName);
              return `/residential/properties/${city}/${area}/${bhk}-${propertyType}-for-${transactionType}/${propertyNameSlug}/${property.airtable_id}`;
            } else {
              // Commercial property URL
              const rawPropertyType = formatValue(property.propertyType);
              const propertyType = slugify(rawPropertyType);
              const transactionType = slugify(formatValue(property.transactionType));
              const rawName = property.name || "property"; // Default fallback
              const propertyNameSlug = slugify(rawName);
              return `/commercial/properties/${city}/${area}/${propertyType}-for-${transactionType}/${propertyNameSlug}/${property.airtable_id}`;
            }
          };
          


          // Function to format Indian price
export const formatIndianPrice = (price: number): string => {
  const removeTrailingZeros = (num: number) => 
      num.toFixed(2).replace(/\.?0+$/, '');

  if (price >= 10000000) { // ≥ 1 Crore
      return `${removeTrailingZeros(price / 10000000)} Cr`;
  } else if (price >= 100000) { // ≥ 1 Lakh
      return `${removeTrailingZeros(price / 100000)} L`;
  } else if (price >= 1000) { // ≥ 1 Thousand
      return `${removeTrailingZeros(price / 1000)}K`;
  }
  return price.toString();
}


export const parsePropertyConfig = (config: string): {
  bhkCount: string;
  propertyType: string;
  transactionType: string;
} => {
  // Validate input is a non-empty string
  if (typeof config !== 'string' || config.trim() === '') {
    return { bhkCount: "3", propertyType: "unknown", transactionType: "unknown" };
  }

  // Match the pattern: e.g., "4-bhk-bungalow-villa-for-rent"
  const match = config.match(/(\d+)-bhk-(.*)-for-(.*)/);
  if (!match) {
    console.error(`Invalid property config format: ${config}`);
    return { bhkCount: "3", propertyType: "unknown", transactionType: "unknown" };
  }

  // Destructure the match array, skipping the full match (index 0)
  const [, bhkCount, propertyType, transactionType] = match;

  // Return with fallbacks
  return { 
    bhkCount: bhkCount || "3", 
    propertyType: propertyType || "unknown", 
    transactionType: transactionType || "unknown"
  };
};

export const parseCommercialPropertyConfig = (config: string): {
  propertyType: string;
  transactionType: string;
} => {
  // Validate input is a non-empty string
  if (typeof config !== 'string' || config.trim() === '') {
    return { propertyType: "unknown", transactionType: "unknown" };
  }

  // Match the pattern: e.g., "office-space-for-rent"
  const match = config.match(/(.*)-for-(.*)/);
  if (!match) {
    console.error(`Invalid commercial property config format: ${config}`);
    return { propertyType: "unknown", transactionType: "unknown" };
  }

  // Destructure the match array, skipping the full match (index 0)
  const [, propertyType, transactionType] = match;

  // Additional validation with fallbacks
  return { 
    propertyType: propertyType || "unknown", 
    transactionType: transactionType || "unknown" 
  };
};