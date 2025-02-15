
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

    export const fetchResidentialProjects = async ({ page = 1, limit = 50, offset = 0 } = {}): Promise<ResidentialProjectsApiResponse> => 
        {
  
        const res = await fetch(`https://test-vision-api-389008.el.r.appspot.com/residential_projects?page=${page}&limit=${limit}&offset=${offset}`);
        if (!res.ok) {
          throw new Error('API response was not ok');
        }
        return res.json();
      };