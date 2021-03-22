export interface ServiceErrorInput {
    message: string;
    service: string;
}
export declare class ServiceError extends Error {
    service: string;
    constructor({ message, service }: ServiceErrorInput);
}
export default ServiceError;
