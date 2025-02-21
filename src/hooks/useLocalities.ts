// src/hooks/useLocalities.ts
import { useQuery } from '@tanstack/react-query';
import { fetchLocalities } from '../services/fetchLocalitiesService';



const useLocalities = () => {

    return useQuery<string[], Error>({
        queryKey: ['localities'],
        queryFn: fetchLocalities,
        staleTime: 1000 * 60 * 10,
    });

}

export default useLocalities;