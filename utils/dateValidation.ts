import { MONTHS } from "@/constants/appConstants";
// Gregorian leap year rule: divisible by 4, except centuries (divisible by 100)
// unless they're also divisible by 400 — so 2024 and 2000 are leap years,
// but 1900 and 2023 are not.
export const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export const daysInMonth = (monthIndex: number, year: number): number => {
  if (monthIndex === 1) return isLeapYear(year) ? 29 : 28; // February
  const month = monthIndex + 1; // 1-indexed for the formula below
  return 31 - ((month - 1) % 7) % 2;
};

// Strips non-digits and clamps the value to [min, max] once it has enough
// digits to be unambiguous. A partial entry like "2" (for an hour field
// capped at 23) is left alone so the user can still type "23" — but "29"
// gets pulled down to "23" the moment it goes out of range.
export const sanitizeNumeric = (
  raw: string,
  { maxLength, min, max }: { maxLength: number; min: number; max: number },
): string => {
  const digits = raw.replace(/[^0-9]/g, "").slice(0, maxLength);
  if (digits === "") return digits;
  const n = parseInt(digits, 10);
  if (n > max) return String(max);
  if (digits.length === maxLength && n < min) return String(min);
  return digits;
};

export interface DateValidationError {
  message: string;
  field: "day" | "year";
}

// Day/hour/minutes are clamped to a plausible range as the user types
// (see sanitizeNumeric), but a day like 31 is only invalid in
// combination with a specific month/year (e.g. 31 February) — that
// can't be caught while typing, so it's validated here instead.
//
// Note: circular-natal-horoscope-js only supports CE dates (year > 0),
// despite its own parameter comment misleadingly saying ">= 0".
export const validateNatalDate = (
  day: string,
  month: string,
  year: string,
  currentYear: number,
): DateValidationError | null => {
  const dayNum = parseInt(day, 10);
  const yearNum = parseInt(year, 10);
  const monthIndex = MONTHS.indexOf(month || "January");

  if (yearNum < 1 || yearNum > currentYear + 1) {
    return {
      message: "Year must be greater than 0 (CE dates only).",
      field: "year",
    };
  }

  const maxDay = daysInMonth(monthIndex, yearNum);
  if (dayNum < 1 || dayNum > maxDay) {
    return {
      message: `${month || "January"} doesn't have a day ${dayNum}.`,
      field: "day",
    };
  }

  return null;
};