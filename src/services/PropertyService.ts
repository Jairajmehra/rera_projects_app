
const API_BASE_URL = 'http://192.168.29.3:8086';

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
    bhk: string;
    airtable_id: string;
    linked_project_rera: string;
}
export interface CommercialProperty 
{
    name: string;
    price: number;
    transactionType: string;
    photos: string | string[];
    locality: string | string[];
    size: number;
    propertyType: string | string[];
    coordinates: string;
    landmark: string;
    condition: string;
    date: string;
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
export interface CommercialPropertiesApiResponse 
{
  has_more: boolean;
  limit: number;
  offset: number;
  properties:  CommercialProperty[];
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

export interface FetchCommercialPropertiesParams {
  page?: number;
  limit?: number;
  offset?: number;
  bounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
  };
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

const api_call_url = `${API_BASE_URL}/residential_properties?${searchParams.toString()}`;

const res = await fetch(api_call_url);
if (!res.ok) {
  throw new Error('API response was not ok');
}
return res.json();
};

export const fetchCommercialProperties = async ({ params}: { params: FetchCommercialPropertiesParams}): Promise<CommercialPropertiesApiResponse> => 
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
  
  const api_call_url = `${API_BASE_URL}/commercial_properties?${searchParams.toString()}`;
  
  const res = await fetch(api_call_url);
  if (!res.ok) {
    throw new Error('API response was not ok');
  }
  return res.json();
  };


export const getResidentialPropertyById = async (id: string): Promise<ResidentialProperty> => {

  const res = await fetch(`${API_BASE_URL}/residential_property_by_id?propertyId=${id}`);
  if (!res.ok) {
 
    throw new Error('API response was not ok');
  }
  return res.json();
};

export const  getCommercialPropertyById = async (id: string): Promise<CommercialProperty> => {

  const res = await fetch(`${API_BASE_URL}/commercial_property_by_id?propertyId=${id}`);
  if (!res.ok) {
 
    throw new Error('API response was not ok');
  }
  return res.json();
};