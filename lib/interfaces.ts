export interface AuthenticationOptions {
  apiKey: string;
}

export interface BasiqAPIOptions {
  baseUrl?: string;
  auth: AuthenticationOptions;
}

export interface JwtToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface JwtTokenDecoded {
  partnerid: string;
  applicationid: string;
  exp: number;
  iat: number;
  version: string;
}

export interface ConnectionCreateOptions {
  loginId: string;
  password: string;
  securityCode?: string;
  externalUserId: string;
  institution: {
    id: string;
  };
}

export interface ConnectionUpdateOptions {
  loginId?: string;
  password?: string;
  securityCode?: string;
  externalUserId?: string;
}

export interface BasiqResponse {
  status: number;
  statusText: string;
  body: any;
  headers?: any;
}

export type BasiqPromise = Promise<BasiqResponse>;
