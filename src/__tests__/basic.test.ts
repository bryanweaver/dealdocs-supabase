/**
 * Basic test to verify test setup is working
 */
import { describe, it, expect } from "vitest";

describe("Basic Test Suite", () => {
  it("should run basic arithmetic test", () => {
    expect(2 + 2).toBe(4);
  });

  it("should test string operations", () => {
    expect("hello".toUpperCase()).toBe("HELLO");
  });

  it("should test array operations", () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr.includes(2)).toBe(true);
  });

  it("should test object operations", () => {
    const obj = { name: "test", value: 42 };
    expect(obj.name).toBe("test");
    expect(obj.value).toBe(42);
  });
});
