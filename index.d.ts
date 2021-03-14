import { RequestInit } from 'node-fetch';

interface ServiceErrorInput {
    message: string;
    service: string;
}
declare class ServiceError extends Error {
    service: string;
    constructor({ message, service }: ServiceErrorInput);
}

interface POSTALCODE {
    cep: string;
    state: string;
    city: string;
    street: string;
    neighborhood: string;
    service: string;
}

interface InitOptions {
    timeOut: number;
}
interface Module {
    type: "Service";
    name: string;
    country: string;
    codeLength: number;
}
interface ServiceModule<TOptions = object> extends Module {
    init(serviceOptions: TOptions, postalCodeOptions: InitOptions): void;
    get(postalCodeClean: string): Promise<POSTALCODE | ServiceError>;
}
interface ServiceOptions {
    url: string;
    fetchinit?: RequestInit;
}
declare class Service implements ServiceModule<ServiceOptions> {
    private options;
    private postalCodeOptions;
    name: string;
    type: "Service";
    country: string;
    codeLength: number;
    constructor({ options, postalCodeOptions, }?: {
        options?: ServiceOptions;
        postalCodeOptions?: InitOptions;
    });
    getDefaultsOptions(): ServiceOptions;
    init(options: ServiceOptions | undefined, postalCodeOptions: InitOptions | undefined): void;
    get(postalCodeClean: string): Promise<POSTALCODE | ServiceError>;
    private analyzeAndParseResponse;
    private checkForError;
    private extractCepValuesFromResponse;
    private throwApplicationError;
}

export default Service;
export { InitOptions, Module, Service, ServiceModule, ServiceOptions };
