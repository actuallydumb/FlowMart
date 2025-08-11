import {
  hasRole,
  hasAnyRole,
  hasAllRoles,
  isAdmin,
  isDeveloper,
  isBuyer,
} from "@/types";

describe("Role Utility Functions", () => {
  describe("hasRole", () => {
    it("should return true when user has the required role", () => {
      const userRoles = ["DEVELOPER", "BUYER"];
      expect(hasRole(userRoles, "DEVELOPER")).toBe(true);
      expect(hasRole(userRoles, "BUYER")).toBe(true);
    });

    it("should return false when user does not have the required role", () => {
      const userRoles = ["DEVELOPER", "BUYER"];
      expect(hasRole(userRoles, "ADMIN")).toBe(false);
    });

    it("should handle empty roles array", () => {
      const userRoles: string[] = [];
      expect(hasRole(userRoles, "DEVELOPER")).toBe(false);
    });
  });

  describe("hasAnyRole", () => {
    it("should return true when user has at least one of the required roles", () => {
      const userRoles = ["DEVELOPER", "BUYER"];
      expect(hasAnyRole(userRoles, ["ADMIN", "DEVELOPER"])).toBe(true);
      expect(hasAnyRole(userRoles, ["BUYER", "ADMIN"])).toBe(true);
    });

    it("should return false when user has none of the required roles", () => {
      const userRoles = ["DEVELOPER", "BUYER"];
      expect(hasAnyRole(userRoles, ["ADMIN"])).toBe(false);
    });

    it("should handle empty required roles array", () => {
      const userRoles = ["DEVELOPER", "BUYER"];
      expect(hasAnyRole(userRoles, [])).toBe(false);
    });
  });

  describe("hasAllRoles", () => {
    it("should return true when user has all required roles", () => {
      const userRoles = ["DEVELOPER", "BUYER", "ADMIN"];
      expect(hasAllRoles(userRoles, ["DEVELOPER", "BUYER"])).toBe(true);
    });

    it("should return false when user is missing any required role", () => {
      const userRoles = ["DEVELOPER", "BUYER"];
      expect(hasAllRoles(userRoles, ["DEVELOPER", "ADMIN"])).toBe(false);
    });

    it("should return true for empty required roles array", () => {
      const userRoles = ["DEVELOPER", "BUYER"];
      expect(hasAllRoles(userRoles, [])).toBe(true);
    });
  });

  describe("isAdmin", () => {
    it("should return true when user has ADMIN role", () => {
      const userRoles = ["ADMIN"];
      expect(isAdmin(userRoles)).toBe(true);
    });

    it("should return true when user has ADMIN role among others", () => {
      const userRoles = ["DEVELOPER", "ADMIN", "BUYER"];
      expect(isAdmin(userRoles)).toBe(true);
    });

    it("should return false when user does not have ADMIN role", () => {
      const userRoles = ["DEVELOPER", "BUYER"];
      expect(isAdmin(userRoles)).toBe(false);
    });
  });

  describe("isDeveloper", () => {
    it("should return true when user has DEVELOPER role", () => {
      const userRoles = ["DEVELOPER"];
      expect(isDeveloper(userRoles)).toBe(true);
    });

    it("should return true when user has DEVELOPER role among others", () => {
      const userRoles = ["ADMIN", "DEVELOPER", "BUYER"];
      expect(isDeveloper(userRoles)).toBe(true);
    });

    it("should return false when user does not have DEVELOPER role", () => {
      const userRoles = ["ADMIN", "BUYER"];
      expect(isDeveloper(userRoles)).toBe(false);
    });
  });

  describe("isBuyer", () => {
    it("should return true when user has BUYER role", () => {
      const userRoles = ["BUYER"];
      expect(isBuyer(userRoles)).toBe(true);
    });

    it("should return true when user has BUYER role among others", () => {
      const userRoles = ["ADMIN", "DEVELOPER", "BUYER"];
      expect(isBuyer(userRoles)).toBe(true);
    });

    it("should return false when user does not have BUYER role", () => {
      const userRoles = ["ADMIN", "DEVELOPER"];
      expect(isBuyer(userRoles)).toBe(false);
    });
  });
});
