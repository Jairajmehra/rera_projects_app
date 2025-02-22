interface LocalitiesResponse {
  localities: string[];
}

export const fetchLocalities = async (): Promise<string[]> => {
  const res = await fetch('http://192.168.29.3:8096/get_localities');
  if (!res.ok) {
    throw new Error('API response was not ok');
  }
  const data: LocalitiesResponse = await res.json();
  return data.localities;
};