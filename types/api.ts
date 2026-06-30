export interface Degree {
  _id: string;
  sign: string;
  degree: number;
  title: string;
  keynote: string;
  description: string;
}
 
export interface LocationResult {
  display_name: string;
  place_id: string;
  lat: string;
  lon: string;
}
 
export interface LocationItem {
  name: string;
  id: string;
  lat: string;
  lon: string;
}
 
export interface Coordinates {
  lat: string;
  lon: string;
}
 
export interface PlanetDegree {
  key: string;
  label: string;
  sign: string;
  signKey: string;
  degrees: string;
}
 
/**
 * Minimal shape we actually read off `circular-natal-horoscope-js` objects.
 * The library ships no usable TS types, so instead of letting `any` leak
 * into screen/business logic we narrow to this shape at the one place we
 * read library output (see services/astrology.ts).
 */
export interface CelestialBodyLike {
  key: string;
  label: string;
  Sign?: {
    label?: string;
    key?: string;
  };
  ChartPosition?: {
    Ecliptic?: {
      ArcDegreesFormatted30?: string;
    };
  };
}
 
/** Discriminated union so callers must handle the error case explicitly. */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
 

