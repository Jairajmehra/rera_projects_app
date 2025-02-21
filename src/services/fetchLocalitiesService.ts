interface Locality {
  name: string;
}

export const fetchLocalities = async (): Promise<string[]> => {
  const res = await fetch('http://192.168.1.186:8094/get_localities');
  if (!res.ok) {
    throw new Error('API response was not ok');
  }
  const data: Locality[] = await res.json();
  return data.map(loc => loc.name);
};