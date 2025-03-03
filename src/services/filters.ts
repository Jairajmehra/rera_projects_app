// Define Filters interface if you haven't already:
export interface ResidentialFilters {
    bhks: string[];
    propertyType: string[];
    locations: string[];
    transactionType: string[];
    priceMin: number;
    priceMax: number;
  }

//   export interface CommercialFilters {
//     propertyType: string[];
//     locations: string[];
//     transactionType: string[];
//     priceMin: number;
//     priceMax: number;
//   }