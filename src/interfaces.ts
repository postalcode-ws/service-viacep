import { ServiceError } from "./errors/ServiceError";

export interface PostalCodeError {
  message: string;
  type: string;
  errors: ServiceError[];
}

export interface POSTALCODE {
  cep: string;
  state: string;
  city: string;
  street: string;
  neighborhood: string;
  service: string;
}

//faz parte dos serviços, acima tem que vim no postalcode
export interface ServiceResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}
