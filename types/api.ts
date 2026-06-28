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