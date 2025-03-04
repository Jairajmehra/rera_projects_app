import { useQuery } from '@tanstack/react-query';
import { fetchCommercialProperties, CommercialPropertiesApiResponse } from '../services/PropertyService';
import { FetchCommercialPropertiesParams } from '../services/PropertyService';

const useCommercialProperties = ({page = 1, limit = 200, offset = 0, bounds, locality, propertyType, transactionType, priceMin, priceMax}: FetchCommercialPropertiesParams) => {

    return useQuery<CommercialPropertiesApiResponse, Error>({
      queryKey: ['commercialProperties', bounds, locality, propertyType, transactionType, priceMin, priceMax, page, limit, offset],
      queryFn: () => fetchCommercialProperties({
        params: {
            page,
            limit,
            offset,
            bounds,
            locality: locality,
            propertyType: propertyType,
            transactionType: transactionType,
            priceMin: priceMin,
            priceMax: priceMax,
        }
      }),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

export default useCommercialProperties;