export interface ServiceErrorInput {
  message: string;
  service: string;
}
export class ServiceError extends Error {
  public service: string;
  constructor({ message, service }: ServiceErrorInput) {
    /* istanbul ignore else */
    super();

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ServiceError.prototype);

    this.name = "ServiceError";
    this.service = service;
    this.message = message;
  }
}

export default ServiceError;
