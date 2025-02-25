import { useQuery } from '@tanstack/react-query';
import { fetchResidentialProperties, ResidentialPropertiesApiResponse } from '../services/residentialPropertyService';
import { Filters } from '../app/map/page';

//const API_URL = 'https://test-vision-api-389008.el.r.appspot.com';

interface UseResidentialPropertiesApiParams {
    offset?: number;
    limit?: number;
    page?: number;
    bounds?: {
        north: number;
        south: number;
        east: number;
        west: number;
  }
  filters?: Filters;
}


const useResidentialProperties = ({page = 1, limit = 200, offset = 0, bounds, filters}: UseResidentialPropertiesApiParams) => {

    return useQuery<ResidentialPropertiesApiResponse, Error>({
      queryKey: ['residentialProperties', bounds, filters, page, limit, offset],
      queryFn: () => fetchResidentialProperties({
        params: {
            page,
            limit,
            offset,
            bounds,
            bhks: filters?.bhks,
            locality: filters?.locations,
            propertyType: filters?.propertyType,
            transactionType: filters?.transactionType?.join(','),
            priceMin: filters?.priceMin,
            priceMax: filters?.priceMax,
        }
      }),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

export default useResidentialProperties;