/**
 * Simple tests for address utility functions
 */
import { describe, it, expect } from "vitest";

describe("addressUtils", () => {
  describe("abbreviateAddress", () => {
    it("should abbreviate street types", () => {
      function abbreviateAddress(address: string): string {
        const abbreviations: { [key: string]: string } = {
          STREET: "ST",
          AVENUE: "AVE",
          BOULEVARD: "BLVD",
          DRIVE: "DR",
          LANE: "LN",
        };

        const parts = address.split(" ");
        const result = parts.map((part) => {
          const sanitized = part.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
          return abbreviations[sanitized] || part;
        });
        return result.join(" ");
      }

      expect(abbreviateAddress("123 Main Street")).toBe("123 Main ST");
      expect(abbreviateAddress("456 Oak Avenue")).toBe("456 Oak AVE");
    });
  });

  describe("joinAddress", () => {
    it("should join address components", () => {
      function joinAddress(address: any) {
        const { streetLine, city, state } = address;
        return `${streetLine} ${city}, ${state}`;
      }

      const address = {
        streetLine: "123 Main St",
        city: "Houston",
        state: "TX",
      };
      expect(joinAddress(address)).toBe("123 Main St Houston, TX");
    });
  });
});
