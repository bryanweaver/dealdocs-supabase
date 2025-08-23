/**
 * Simple utility function tests
 */
import { describe, it, expect } from "vitest";

describe("Utility Functions", () => {
  describe("String Utilities", () => {
    it("should parse lot and block information", () => {
      function parseLotBlock(text: string) {
        text = text.toUpperCase();
        const lotPattern = /(?:LOT|LT)\s*(\w+)/;
        const blockPattern = /(?:BLOCK|BLK)\s*(\w+)/;

        const lotMatch = text.match(lotPattern);
        const blockMatch = text.match(blockPattern);

        return {
          lot: lotMatch ? lotMatch[1] : null,
          block: blockMatch ? blockMatch[1] : null,
          legalDescription: text,
        };
      }

      const result = parseLotBlock("LT 1 BLK 2 SUNSET ADDITION");
      expect(result.lot).toBe("1");
      expect(result.block).toBe("2");
      expect(result.legalDescription).toBe("LT 1 BLK 2 SUNSET ADDITION");
    });

    it("should validate email addresses", () => {
      function validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }

      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });

    it("should format phone numbers", () => {
      function formatPhoneNumber(phone: string): string {
        const cleaned = phone.replace(/\D/g, "");
        if (cleaned.length === 10) {
          return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return phone;
      }

      expect(formatPhoneNumber("7135551234")).toBe("(713) 555-1234");
      expect(formatPhoneNumber("713-555-1234")).toBe("(713) 555-1234");
      expect(formatPhoneNumber("123")).toBe("123");
    });
  });

  describe("Validation Utilities", () => {
    it("should validate required fields", () => {
      function validateRequired(value: any): boolean {
        return value !== null && value !== undefined && value !== "";
      }

      expect(validateRequired("test")).toBe(true);
      expect(validateRequired(0)).toBe(true);
      expect(validateRequired("")).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });

    it("should validate numbers", () => {
      function validateNumber(value: any): boolean {
        return !isNaN(Number(value)) && Number(value) >= 0;
      }

      expect(validateNumber("123")).toBe(true);
      expect(validateNumber(456)).toBe(true);
      expect(validateNumber("abc")).toBe(false);
      expect(validateNumber(-1)).toBe(false);
    });
  });

  describe("Date Utilities", () => {
    it("should format dates", () => {
      function formatDate(date: Date): string {
        return date.toISOString().split("T")[0];
      }

      const testDate = new Date("2024-01-15");
      expect(formatDate(testDate)).toBe("2024-01-15");
    });

    it("should validate dates", () => {
      function isValidDate(dateString: string): boolean {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
      }

      expect(isValidDate("2024-01-15")).toBe(true);
      expect(isValidDate("invalid-date")).toBe(false);
    });
  });

  describe("Array Utilities", () => {
    it("should find unique items", () => {
      function getUniqueItems<T>(arr: T[]): T[] {
        return [...new Set(arr)];
      }

      expect(getUniqueItems([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
      expect(getUniqueItems(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
    });

    it("should chunk arrays", () => {
      function chunkArray<T>(arr: T[], size: number): T[][] {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
          chunks.push(arr.slice(i, i + size));
        }
        return chunks;
      }

      expect(chunkArray([1, 2, 3, 4, 5, 6], 2)).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
      expect(chunkArray([1, 2, 3, 4, 5], 3)).toEqual([
        [1, 2, 3],
        [4, 5],
      ]);
    });
  });
});
