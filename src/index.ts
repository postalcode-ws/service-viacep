import fetch, { RequestInit, Response } from "node-fetch";
import { ServiceError } from "./errors/ServiceError";
import { POSTALCODE, ServiceResponse } from "./interfaces";
import { defaults } from "./utils";

export interface InitOptions {
  timeOut: number;
}

export interface Module {
  type: "Service";
  name: string;
  country: string;
  codeLength: number;
}

export interface ServiceModule<TOptions = object> extends Module {
  init(serviceOptions: TOptions, postalCodeOptions: InitOptions): void;
  get(postalCodeClean: string): Promise<POSTALCODE | ServiceError>;
}

//Daqui para baixo faz parte do modulo.
export interface ServiceOptions {
  url?: string;
  fetchinit?: RequestInit;
}

export class Service implements ServiceModule<ServiceOptions> {
  private options: ServiceOptions | undefined;
  private postalCodeOptions: InitOptions | undefined;
  name: string;
  type: "Service";
  country: string;
  codeLength: number;

  constructor({
    options,
    postalCodeOptions,
  }: {
    options?: ServiceOptions;
    postalCodeOptions?: InitOptions;
  } = {}) {
    this.name = "ViaCep";
    this.country = "Brasil";
    this.type = "Service";
    this.codeLength = 8;
    this.init(options, postalCodeOptions);
  }

  getDefaultsOptions(): ServiceOptions {
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
  }

  init(
    options?: ServiceOptions | undefined,
    postalCodeOptions?: InitOptions | undefined
  ): void {
    this.options = defaults<ServiceOptions>(
      this.getDefaultsOptions(),
      options || {}
    );
    this.postalCodeOptions = postalCodeOptions;
  }

  public async get(
    postalCodeClean: string
  ): Promise<POSTALCODE | ServiceError> {
    let url: string;

    if (this.options!.url) {
      url = this.options?.url.replace("[>CODE<]", postalCodeClean) as string;
    } else {
      throw new Error("invalid Url");
    }

    return await fetch(url, {
      ...this.options!.fetchinit,
      ...this.postalCodeOptions,
    })
      .then(this.analyzeAndParseResponse)
      .then(this.checkForError)
      .then(this.extractCepValuesFromResponse)
      .catch(this.throwApplicationError);
  }

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
      cep: object.cep!.replace("-", ""),
      state: object.uf,
      city: object.localidade,
      neighborhood: object.bairro,
      street: object.logradouro,
      service: this.name,
    };
  };

  private throwApplicationError = (error: Error): Promise<ServiceError> => {
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
