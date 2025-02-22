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
}
}

export const fetchResidentialProperties = async ({ page = 1, limit = 50, offset = 0, bounds}: FetchResidentialPropertiesParams = {}): Promise<ResidentialPropertiesApiResponse> => 
{

const boundsParams = bounds ? `&minLat=${bounds.south}&maxLat=${bounds.north}&minLng=${bounds.west}&maxLng=${bounds.east}` : '';
const api_call_url = `http://192.168.29.3:8096/residential_properties?page=${page}&limit=${limit}&offset=${offset}${boundsParams}`;
console.log('API call URL:', api_call_url);
const res = await fetch(api_call_url);
if (!res.ok) {
  throw new Error('API response was not ok');
}
return res.json();
};