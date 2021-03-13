import { expect } from "chai";
import { ServiceError } from "../../src/errors/ServiceError";

describe("Tests for Errors handler", () => {
  describe("when imported", () => {
    it("should return a Function", () => {
      expect(ServiceError).to.be.a("Function");
    });
  });

  describe("when invocked", () => {
    it("should return a throw error", () => {
      expect(() => {
        throw new ServiceError({ message: "Test Error", service: "ViaCep" });
      }).to.be.throw("Test Error");
    });
  });
});
