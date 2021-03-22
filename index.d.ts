import { InitOptions, POSTALCODE, ServiceError as IServiceError, ServiceModule } from "@postalcode/postalcode";
export interface ServiceOptions {
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
    init: (options?: ServiceOptions | undefined, postalCodeOptions?: InitOptions | undefined) => this;
    get: (postalCodeClean: string) => Promise<POSTALCODE | IServiceError>;
    private analyzeAndParseResponse;
    private checkForError;
    private extractCepValuesFromResponse;
    private throwApplicationError;
}
export default Service;
