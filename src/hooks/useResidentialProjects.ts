import { useQuery } from '@tanstack/react-query';
import { fetchResidentialProjects, ResidentialProjectsApiResponse } from '../services/residentialProjectService';

const API_URL = 'https://test-vision-api-389008.el.r.appspot.com';

interface UseResidentialProjectsApiParams {
    offset?: number;
    limit?: number;
    page?: number;
  }

const useResidentialProjects = ({page=1, limit=100, offset=0}: UseResidentialProjectsApiParams) => {

    return useQuery<ResidentialProjectsApiResponse, Error>({
        queryKey: ['residential-projects', page, limit, offset],
        queryFn: () => fetchResidentialProjects({page, limit, offset}),
        placeholderData: keepPreviousData => keepPreviousData,
        staleTime: 1000 * 60 * 10,
    });

};

export default useResidentialProjects;