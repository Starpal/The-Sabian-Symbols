import { Degree, BackgroundImage } from '../types/api';

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

export const fetchRandomBackgroundImage = async (): Promise<[string, string]> => {
  try {
    const res = await fetch(`${API_URL}/uploads`, {
      method: 'GET',
      headers: defaultHeaders,
    });
    const data: BackgroundImage = await res.json();
    return [data.contentType, data.imageBase64];
  } catch (error) {
    return handleApiError(error, 'fetchRandomBackgroundImage');
  }
};