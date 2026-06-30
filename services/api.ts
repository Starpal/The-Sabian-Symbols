import { Degree, LocationItem, LocationResult } from "@/types/api";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "cache-control": "no-cache",
};

/**
 * Nominatim's usage policy requires a way to identify the calling
 * application (https://operations.osmfoundation.org/policies/nominatim/).
 * React Native can't set a custom User-Agent on fetch, so we identify via
 * a referer-style header instead.
 */
const geocodingHeaders: HeadersInit = {
  Accept: "application/json",
  "cache-control": "no-cache",
  "Accept-Language": "en",
};

class ApiError extends Error {
  constructor(
    message: string,
    public readonly context: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Wraps fetch with: a real status check (fetch only rejects on network
 * failure, never on 4xx/5xx), JSON parsing, and a consistent error context
 * so failures are debuggable instead of silently returning `undefined`
 * fields to the UI.
 */
async function request<T>(
  url: string,
  options: RequestInit,
  context: string,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (error) {
    console.error(`[${context}] network error:`, error);
    throw new ApiError("Network request failed. Check your connection.", context);
  }

  if (!res.ok) {
    console.error(`[${context}] HTTP ${res.status}`);
    throw new ApiError(
      `Request failed (${res.status}). Please try again.`,
      context,
      res.status,
    );
  }

  try {
    return (await res.json()) as T;
  } catch (error) {
    console.error(`[${context}] invalid JSON response:`, error);
    throw new ApiError("Received an invalid response from the server.", context);
  }
}

export const fetchRandomDegree = (): Promise<Degree[]> =>
  request<Degree[]>(
    `${API_URL}/degree`,
    { method: "GET", headers: defaultHeaders },
    "fetchRandomDegree",
  );

export const fetchDegreeBySignAndDegree = (
  sign: string,
  degree: number,
): Promise<Degree> =>
  request<Degree>(
    `${API_URL}/DBdegree`,
    {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({ sign, degree }),
    },
    "fetchDegreeBySignAndDegree",
  );

export const fetchCoordinates = async (
  query: string,
  signal?: AbortSignal,
): Promise<LocationItem[]> => {
  const data = await request<LocationResult[]>(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`,
    { method: "GET", headers: geocodingHeaders, signal },
    "fetchCoordinates",
  );

  return data.map((item) => ({
    name: item.display_name,
    id: item.place_id,
    lat: item.lat,
    lon: item.lon,
  }));
};

export { ApiError };
