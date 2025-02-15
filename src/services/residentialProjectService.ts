
    export interface ResidentialProject 
        {
            bhk: string | string[];
            brochureLink: string;
            certificateLink: string;
            configuration: 
            {
                errorType?: string;
                isStale: boolean;
                state: string;
                value: any;
            };
            coordinates: string;
            coverPhotoLink: string;
            endDate: string;
            localityNames: string | string[];
            mobile: string;
            name: string;
            numberOfTowers: number;
            photos: string;
            planPassingAuthority: string;
            price: 
            {
                errorType?: string;
                isStale: boolean;
            state: string;
            value: any;
            };
            projectAddress: string;
            projectLandArea: number;
            projectStatus: string;
            projectType: string | string[];
            promoterName: string;
            rera: string;
            startDate: string;
            totalUnits: number;
            totalUnitsAvailable: number;
        }

    export interface ResidentialProjectsApiResponse 
    {
        has_more: boolean;
        limit: number;
        offset: number;
        projects: ResidentialProject[];
        status: string;
        total: number;
    }

    interface FetchResidentialProjectsParams {
        page?: number;
        limit?: number;
        offset?: number;
        bounds?: {
            north: number;
            south: number;
            east: number;
            west: number;
        }
    }

    export const fetchResidentialProjects = async ({ page = 1, limit = 50, offset = 0, bounds}: FetchResidentialProjectsParams = {}): Promise<ResidentialProjectsApiResponse> => 
        {
        
        const boundsParams = bounds ? `&minLat=${bounds.south}&maxLat=${bounds.north}&minLng=${bounds.west}&maxLng=${bounds.east}` : '';
        const api_call_url = `https://test-vision-api-389008.el.r.appspot.com/residential_projects?page=${page}&limit=${limit}&offset=${offset}${boundsParams}`;
        console.log('API call URL:', api_call_url);
        const res = await fetch(api_call_url);
        if (!res.ok) {
          throw new Error('API response was not ok');
        }
        return res.json();
      };