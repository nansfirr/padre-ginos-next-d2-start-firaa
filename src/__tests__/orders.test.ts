import { describe, expect, test } from "vitest";
import {
  canTransition,
  isOrderStatus,
  nextStatuses,
  ORDER_STATUSES,
} from "@/lib/orders";

describe("nextStatuses", () => {
  test("follows the kitchen workflow, and final statuses have no next step", () => {
    expect(nextStatuses("pending")).toEqual(["preparing", "cancelled"]);
    expect(nextStatuses("preparing")).toEqual(["ready", "cancelled"]);
    expect(nextStatuses("ready")).toEqual(["delivered"]);
    expect(nextStatuses("delivered")).toEqual([]);
    expect(nextStatuses("cancelled")).toEqual([]);
  });
});

describe("canTransition", () => {
  test("allows forward steps", () => {
    expect(canTransition("pending", "preparing")).toBe(true);
    expect(canTransition("ready", "delivered")).toBe(true);
  });
  test("rejects going back, skipping, and leaving a final status", () => {
    expect(canTransition("delivered", "pending")).toBe(false);
    expect(canTransition("ready", "cancelled")).toBe(false);
    expect(canTransition("pending", "ready")).toBe(false);
    for (const s of ORDER_STATUSES) expect(canTransition(s, s)).toBe(false);
  });
});

describe("isOrderStatus", () => {
  test("accepts only the known statuses", () => {
    for (const s of ORDER_STATUSES) expect(isOrderStatus(s)).toBe(true);
    for (const bad of ["shipped", "", "PENDING", 1, null, undefined]) {
      expect(isOrderStatus(bad)).toBe(false);
    }
  });
});