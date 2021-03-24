import {
  InitOptions,
  POSTALCODE,
  ServiceError as IServiceError,
  ServiceModule,
} from "@postalcode/postalcode";
import fetch from "cross-fetch";
import ServiceError from "./errors/ServiceError";
import { ServiceResponse } from "./interfaces";
import { defaults } from "./utils";

export interface ServiceOptions {
  url?: string;
  fetchinit?: RequestInit;
}

class Service implements ServiceModule {
  private options: ServiceOptions | undefined;
  private postalCodeOptions: InitOptions | undefined;
  name: string;
  type: "Service";
  country: string;
  codeLength: number;

  constructor(options?: ServiceOptions) {
    this.name = "ViaCep";
    this.country = "Brasil";
    this.type = "Service";
    this.codeLength = 8;
    this.init(options);
  }

  private getDefaultsOptions = (): ServiceOptions => {
    return {
      url: `https://viacep.com.br/ws/[>CODE<]/json`,
      fetchinit: {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-type": "application/json;charset=utf-8",
        },
        timeout: 30000,
      } as RequestInit,
    };
  };

  public init = (
    options?: ServiceOptions,
    postalCodeOptions?: InitOptions
  ): this => {
    this.options = defaults<ServiceOptions>(
      this.getDefaultsOptions(),
      options || {}
    );
    this.postalCodeOptions = postalCodeOptions;
    return this;
  };

  public get = async (
    postalCodeClean: string
  ): Promise<POSTALCODE | IServiceError> => {
    let url: string;

    if (this.options!.url) {
      url = this.options!.url.replace("[>CODE<]", postalCodeClean) as string;
    } else {
      return this.throwApplicationError(
        new Error(`Invalid url for service ${this.name}.`)
      );
    }

    return await fetch(url, {
      ...this.options!.fetchinit,
      ...this.postalCodeOptions,
    })
      .then(this.analyzeAndParseResponse)
      .then(this.checkForError)
      .then(this.extractCepValuesFromResponse)
      .catch(this.throwApplicationError);
  };

  private analyzeAndParseResponse = async (
    response: Response
  ): Promise<ServiceResponse> => {
    if (response.ok) {
      return await response.json();
    }

    if (response.ok === false && response.status === 400) {
      throw Error(`Invalid code, check your code ${this.name}.`);
    }
    throw Error(`Error connecting to service ${this.name}.`);
  };

  private checkForError = (object: ServiceResponse): ServiceResponse => {
    if (object.erro === true) {
      throw new Error(`Zip code not found on ${this.name} base.`);
    }

    return object;
  };

  private extractCepValuesFromResponse = (
    object: ServiceResponse
  ): POSTALCODE => {
    return {
      postalcode: object.cep!.replace("-", ""),
      state: object.uf,
      city: object.localidade,
      neighborhood: object.bairro,
      street: object.logradouro,
      service: this.name,
    };
  };

  private throwApplicationError = (error: Error): Promise<IServiceError> => {
    const serviceError = new ServiceError({
      message: error.message,
      service: this.name,
    });

    if (error.name === "FetchError") {
      serviceError.message = `Error connecting to ${this.name} service.`;
    }

    throw serviceError;
  };
}

export default Service;
