  // Base filter properties shared by both types
  interface BaseFilters {
    propertyType: string[];
    locations: string[];
    transactionType: string[];
    priceMin: number;
    priceMax: number;
  }
  
  // Residential-specific filters
  export interface ResidentialFilters extends BaseFilters {
    type: 'residential';
    bhks: string[];
  }
  
  // Commercial-specific filters
  export interface CommercialFilters extends BaseFilters {
    type: 'commercial';
    // Add any commercial-specific filters here
  }