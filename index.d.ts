import { ServiceModule, InitOptions, POSTALCODE, ServiceError } from '@postalcode/postalcode';
import { RequestInit } from 'node-fetch';

interface ServiceOptions {
    url?: string;
    fetchinit?: RequestInit;
}
declare class Service implements ServiceModule {
    private options;
    private postalCodeOptions;
    name: string;
    type: "Service";
    country: string;
    codeLength: number;
    constructor(options?: ServiceOptions);
    private getDefaultsOptions;
    init(options?: ServiceOptions, postalCodeOptions?: InitOptions): this;
    get(postalCodeClean: string): Promise<POSTALCODE | ServiceError>;
    private analyzeAndParseResponse;
    private checkForError;
    private extractCepValuesFromResponse;
    private throwApplicationError;
}

export default Service;
export { Service, ServiceOptions };
