import { useQuery } from '@tanstack/react-query';
import { fetchResidentialProjects, ResidentialProjectsApiResponse } from '../services/residentialProjectService';

const API_URL = 'https://test-vision-api-389008.el.r.appspot.com';

interface UseResidentialProjectsApiParams {
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

const useResidentialProjects = ({page=1, limit=100, offset=0, bounds}: UseResidentialProjectsApiParams) => {

    return useQuery<ResidentialProjectsApiResponse, Error>({
        queryKey: ['residential-projects', page, limit, offset,
            bounds ? `&north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}` : ''
        ],
        queryFn: () => fetchResidentialProjects({page, limit, offset, bounds}),
        placeholderData: keepPreviousData => keepPreviousData,
        staleTime: 1000 * 60 * 10,
    });

};

export default useResidentialProjects;