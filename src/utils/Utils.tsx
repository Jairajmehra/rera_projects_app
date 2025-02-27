import { ResidentialProperty } from "../services/residentialPropertyService";


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

          function slugify(value: string): string {
            return value
              .toLowerCase()
              .trim()
              .replace(/\//g, '-')      // Replace slashes with dashe
              .replace(/\s+/g, '-')     // Replace all spaces/tabs/newlines with a single dash
              .replace(/[^\w-]+/g, '')  // Remove any other weird characters (punctuation, etc.)
              .replace(/-+/g, '-');     // Collapse multiple dashes into one
          }
          export const generatePropertyUrl = (property: ResidentialProperty) => {
            // Helper to handle arrays or strings
            const formatValue = (value: string | string[]): string =>
              Array.isArray(value) ? value[0] : value;
          
            const city = slugify("Ahmedabad"); // or slugify(formatValue(property.city)) if city also comes from API
            const area = slugify(formatValue(property.locality));
            const bhk = slugify(formatValue(property.bhk));
            const rawPropertyType = formatValue(property.propertyType);
            const propertyType = slugify(rawPropertyType);
            const transactionType = slugify(formatValue(property.transactionType));
            const rawName = property.name;
            const propertyNameSlug = slugify(rawName);
            return `/residential/properties/${city}/${area}/${bhk}-${propertyType}-for-${transactionType}/${propertyNameSlug}/${property.airtable_id}`;
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