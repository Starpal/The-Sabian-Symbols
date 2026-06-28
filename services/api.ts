import { Degree, LocationItem, LocationResult, PlanetDegree } from '../types/api';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'cache-control': 'no-cache',
};

const handleApiError = (error: unknown, context: string): never => {
  if (error instanceof Error) {
    console.error(`[${context}] error:`, error.message);
  }
  throw error;
};

export const fetchRandomDegree = async (): Promise<Degree[]> => {
  try {
    const res = await fetch(`${API_URL}/degree`, {
      method: 'GET',
      headers: defaultHeaders,
    });
    return res.json();
  } catch (error) {
    return handleApiError(error, 'fetchRandomDegree');
  }
};

export const fetchDegreeBySignAndDegree = async (
  sign: string,
  degree: number
): Promise<Degree> => {
  try {
    const res = await fetch(`${API_URL}/DBdegree`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ sign, degree }),
    });
    return res.json();
  } catch (error) {
    return handleApiError(error, 'fetchDegreeBySignAndDegree');
  }
};

const geocodingHeaders: HeadersInit = {
  'Accept': '*/*',
  'cache-control': 'no-cache',
};

export const fetchCoordinates = async (query: string): Promise<LocationItem[]> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`,
      { method: 'GET', headers: geocodingHeaders }
    );
    const data: LocationResult[] = await res.json();
    return data.map((item) => ({
      name: item.display_name,
      id: item.place_id,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    return handleApiError(error, 'fetchCoordinates');
  }
};