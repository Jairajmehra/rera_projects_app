export interface ResidentialProperty 
{   
    name: string;
    price: number;
    transactionType: string;
    locality: string | string[];
    photos: string | string[];
    size: number;
    propertyType: string | string[];
    coordinates: string;
    landmark: string;
    condition: string;
    date: string;
    bhk: string | string[];
    airtable_id: string;
    linked_project_rera: string;
}

export interface ResidentialPropertiesApiResponse 
{
    has_more: boolean;
    limit: number;
    offset: number;
    properties: ResidentialProperty[];
    status: string;
    total: number;
}

export interface FetchResidentialPropertiesParams {
page?: number;
limit?: number;
offset?: number;
bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
};
bhks?: string[];
locality?: string[];
propertyType?: string[];
transactionType?: string;
priceMin?: number;
priceMax?: number;
}

export const fetchResidentialProperties = async ({ params}: { params: FetchResidentialPropertiesParams}): Promise<ResidentialPropertiesApiResponse> => 
{
const searchParams = new URLSearchParams();

if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.offset) searchParams.append('offset', params.offset.toString());

  // Add bounds params
  if (params.bounds) {
    searchParams.append('north', params.bounds.north.toString());
    searchParams.append('south', params.bounds.south.toString());
    searchParams.append('east', params.bounds.east.toString());
    searchParams.append('west', params.bounds.west.toString());
  }

  // Add filter params
  if (params.bhks?.length) {
    searchParams.append('bhk', params.bhks.join(','));
  }
  if (params.locality?.length) {
    searchParams.append('locality', params.locality.join(','));
  }
  if (params.propertyType?.length) {
    searchParams.append('propertyType', params.propertyType.join(','));
  }
  if (params.transactionType) {
    searchParams.append('transactionType', params.transactionType);
  }
  if (params.priceMin) {
    searchParams.append('priceMin', params.priceMin.toString());
  }
  if (params.priceMax) {
    searchParams.append('priceMax', params.priceMax.toString());
  }

console.log('Search params:', searchParams.toString());

const api_call_url = `https://test-vision-api-389008.el.r.appspot.com/residential_properties?${searchParams.toString()}`;
console.log('API call URL:', api_call_url);
const res = await fetch(api_call_url);
if (!res.ok) {
  throw new Error('API response was not ok');
}
return res.json();
};