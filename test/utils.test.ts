import { expect } from "chai";
import { ServiceOptions } from "../src";
import { defaults } from "../src/utils";

describe("Test for utils", () => {
  describe("when imported defaults", () => {
    it("should return a Function", () => {
      expect(defaults).to.be.a("Function");
    });
  });

  describe("when invocked defaults", () => {
    it("should return new merged default object configs", () => {
      const configs = defaults<ServiceOptions>(
        {
          url: `www.default.com`,
          fetchinit: {
            method: "GET",
            headers: {
              "Content-type": "application/json;charset=utf-8",
            },
          },
        }, //default Options
        {
          url: "www.newurl.com",
          fetchinit: {
            mode: "no-cors",
            headers: {
              "Cache-Control": "no-cache",
              "Content-type": "application/xml;charset=utf-8",
            },
            method: "POST",
          },
        }, //default config for merged
        { url: "www.teste.com", fetchinit: { keepalive: true } } //new configs overwhite
      );

      expect(configs).to.eql({
        url: `www.teste.com`,
        fetchinit: {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Cache-Control": "no-cache",
            "Content-type": "application/xml;charset=utf-8",
          },
          keepalive: true,
        },
      } as ServiceOptions);
    });
  });
});
