import { useQuery } from '@tanstack/react-query';
import { fetchResidentialProperties, ResidentialPropertiesApiResponse } from '../services/PropertyService';
import { FetchResidentialPropertiesParams } from '../services/PropertyService';

const useResidentialProperties = ({page = 1, limit = 200, offset = 0, bounds, bhks, locality, propertyType, transactionType, priceMin, priceMax}: FetchResidentialPropertiesParams) => {

    return useQuery<ResidentialPropertiesApiResponse, Error>({
      queryKey: ['residentialProperties', bounds, bhks, locality, propertyType, transactionType, priceMin, priceMax, page, limit, offset],
      queryFn: () => fetchResidentialProperties({
        params: {
            page,
            limit,
            offset,
            bounds,
            bhks: bhks,
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

export default useResidentialProperties;