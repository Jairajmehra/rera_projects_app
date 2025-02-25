interface LocalitiesResponse {
  localities: string[];
}

export const fetchLocalities = async (): Promise<string[]> => {
  const res = await fetch('https://test-vision-api-389008.el.r.appspot.com/get_localities');
  if (!res.ok) {
    throw new Error('API response was not ok');
  }
  const data: LocalitiesResponse = await res.json();
  return data.localities;
};