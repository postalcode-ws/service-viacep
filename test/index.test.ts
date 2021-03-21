import { POSTALCODE } from "@postalcode/postalcode";
import { expect, use } from "chai";
import * as chaiSubset from "chai-subset";
import * as nock from "nock";
import { join } from "path";
import ViaCepService from "../src";
import ServiceError from "../src/errors/ServiceError";
use(chaiSubset);

describe(`Tests for ViaCepService ${new Date().getTime()}`, () => {
  let ViaCep: ViaCepService;
  before(() => {
    nock.cleanAll();
    nock.disableNetConnect();
    ViaCep = new ViaCepService();
  });

  describe("when imported", () => {
    it("should return a Function", () => {
      expect(ViaCepService).to.be.a("Function");
    });
  });

  describe("when invocked", () => {
    it("should return a Promise", () => {
      expect(ViaCep.get("05010000").then).to.be.a("function");
      expect(ViaCep.get("05010000").catch).to.be.a("function");
    });

    it("should return error handler for invalid config Url", async () => {
      const ViaCepInvalid = new ViaCepService();
      await ViaCepInvalid.init({ url: "" })
        .get("05010000")
        .catch((error: Error) => {
          expect(error).to.be.an.instanceOf(Error);
          expect(error).to.be.containSubset({
            name: "ServiceError",
            message: `Invalid url for service ${ViaCep.name}.`,
            service: ViaCep.name,
          });
        });
    });

    it("should return a Module functions", () => {
      expect(ViaCep.get).to.be.a("function");
      expect(ViaCep.init).to.be.a("function");
    });

    it("should return a properties", () => {
      expect(ViaCep.name).to.be.equal("ViaCep");
      expect(ViaCep.type).to.be.equal("Service");
      expect(ViaCep.country).to.be.equal("Brasil");
      expect(ViaCep.codeLength).to.be.equal(8);
    });
  });

  describe("and when send valid CEP", () => {
    it("should return a valid zip code object", async () => {
      nock("https://viacep.com.br")
        .get("/ws/05010000/json")
        .replyWithFile(200, join(__dirname, "/fixtures/05010000-found.json"));

      await ViaCep.get("05010000").then((Cep) => {
        expect(Cep).to.deep.equal({
          postalcode: "05010000",
          state: "SP",
          city: "São Paulo",
          neighborhood: "Perdizes",
          street: "Rua Caiubi",
          service: ViaCep.name,
        } as POSTALCODE);
      });
    });
  });

  describe("and when send invalid CEP", () => {
    it('should reject with "ServiceError"', async () => {
      nock("https://viacep.com.br")
        .get("/ws/99999999/json")
        .replyWithFile(200, join(__dirname, "/fixtures/error.json"));

      await ViaCep.get("99999999").catch((error: ServiceError) => {
        expect(error).to.be.an.instanceof(ServiceError);
        expect(error).to.be.containSubset({
          name: "ServiceError",
          message: `Zip code not found on ${ViaCep.name} base.`,
          service: ViaCep.name,
        } as ServiceError);
      });
    });
  });

  describe("and when to send an empty value ", () => {
    it('should reject with "ServiceError"', async () => {
      nock("https://viacep.com.br").get("/ws//json").reply(400);

      await ViaCep.get("").catch((error: ServiceError) => {
        expect(error).to.be.an.instanceof(ServiceError);
        expect(error).to.be.containSubset({
          name: "ServiceError",
          message: `Invalid code, check your code ${ViaCep.name}.`,
          service: ViaCep.name,
        });
      });
    });
  });

  describe("and when to send an empty value ", () => {
    it('should reject with "ServiceError"', async () => {
      nock("https://viacep.com.br").get("/ws/45454500/json").reply(500);

      await ViaCep.get("45454500").catch((error: ServiceError) => {
        expect(error).to.be.an.instanceof(ServiceError);
        expect(error).to.be.containSubset({
          name: "ServiceError",
          message: `Error connecting to service ${ViaCep.name}.`,
          service: ViaCep.name,
        });
      });
    });
  });

  afterEach(() => nock.cleanAll);
});
