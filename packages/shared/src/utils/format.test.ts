import { describe, it, expect } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats paise to Indian rupee format", () => {
    expect(formatPrice(12345600)).toBe("₹1,23,456");
  });

  it("formats thousands correctly", () => {
    expect(formatPrice(50000000)).toBe("₹5,00,000");
  });

  it("formats hundreds", () => {
    expect(formatPrice(99900)).toBe("₹999");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("₹0");
  });

  it("rounds small amounts to nearest rupee", () => {
    expect(formatPrice(150)).toBe("₹2");
  });

  it("formats crores", () => {
    expect(formatPrice(1234000000)).toBe("₹1,23,40,000");
  });
});
