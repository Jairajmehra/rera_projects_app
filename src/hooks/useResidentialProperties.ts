import { useQuery } from '@tanstack/react-query';
import { fetchResidentialProperties, ResidentialPropertiesApiResponse } from '../services/residentialPropertyService';

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
}

const useResidentialProperties = ({page=1, limit=100, offset=0, bounds}: UseResidentialPropertiesApiParams) => {

    return useQuery<ResidentialPropertiesApiResponse, Error>({
        queryKey: ['residential-properties', page, limit, offset,
            bounds ? `&north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}` : ''
        ],
        queryFn: () => fetchResidentialProperties({page, limit, offset, bounds}),
        placeholderData: keepPreviousData => keepPreviousData,
        staleTime: 1000 * 60 * 10,
    });

};

export default useResidentialProperties;