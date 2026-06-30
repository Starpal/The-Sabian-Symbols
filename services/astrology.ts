import { Horoscope, Origin } from "circular-natal-horoscope-js";
import { CelestialBodyLike, PlanetDegree } from "@/types/api";

export interface NatalChartInput {
  year: number;
  month: number; // 0-indexed, matches Origin's expectation
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
}

const EXCLUDED_KEYS = new Set(["sirius", "southnode"]);

/**
 * Wraps `circular-natal-horoscope-js`, which ships no TypeScript types and
 * returns loosely-shaped objects. This is the *only* place in the codebase
 * that should reach for `any` — everything downstream gets clean,
 * typed `PlanetDegree[]`.
 */
export const computePlanetDegrees = (
  input: NatalChartInput,
): PlanetDegree[] => {
  const origin = new Origin({
    year: input.year,
    month: input.month,
    date: input.day,
    hour: input.hour,
    minute: input.minute,
    latitude: input.latitude,
    longitude: input.longitude,
  });

  const horoscope = new Horoscope({ origin, language: "en" });

  const celestialBodies: any[] = [...horoscope.CelestialBodies.all];
  const celestialPoints: any[] = horoscope.CelestialPoints.all;

  celestialBodies.push(...celestialPoints);
  celestialBodies.push(horoscope.Ascendant);
  celestialBodies.push(horoscope.Midheaven);

  return celestialBodies
    .filter((body): body is CelestialBodyLike => !EXCLUDED_KEYS.has(body?.key))
    .map((body) => ({
      key: body.key,
      label: body.label,
      sign: body.Sign?.label ?? "",
      signKey: body.Sign?.key ?? "",
      degrees: body.ChartPosition?.Ecliptic?.ArcDegreesFormatted30 ?? "",
    }));
};
