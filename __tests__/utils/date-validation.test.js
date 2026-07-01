import { isLeapYear, daysInMonth, validateNatalDate } from "@/utils/dateValidation";

describe("isLeapYear", () => {
  it("identifies century exceptions correctly", () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
  });
});

describe("daysInMonth", () => {
  it("handles February in leap and non-leap years", () => {
    expect(daysInMonth(1, 2024)).toBe(29);
    expect(daysInMonth(1, 2023)).toBe(28);
  });
});

describe("validateNatalDate", () => {
  it("rejects year 0", () => {
    const error = validateNatalDate("2", "January", "0", 2026);
    expect(error?.field).toBe("year");
  });

  it("rejects 31 February", () => {
    const error = validateNatalDate("31", "February", "2023", 2026);
    expect(error?.field).toBe("day");
  });

  it("accepts a valid date", () => {
    expect(validateNatalDate("29", "February", "2024", 2026)).toBeNull();
  });
});