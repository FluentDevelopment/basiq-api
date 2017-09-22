export interface AuthenticationOptions {
  apiKey: string;
}

export interface BasiqAPIOptions {
  baseURL: string;
  auth: AuthenticationOptions;
}

export interface JwtToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}
