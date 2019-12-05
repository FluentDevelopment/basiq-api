import * as axios from 'axios';
import * as debug from 'debug';
import { decode } from 'jws';
import * as querystring from 'qs';

import { BasiqAPIOptions, BasiqResponse, JwtToken, JwtTokenDecoded } from './interfaces';

const { name, version, homepage } = require('root-require')('package.json');

const log = debug('basiq-api:client');

const userAgent = `${name.split('/').pop()}/${version} node/${process.version} (${homepage})`;
const DEFAULTS: BasiqAPIOptions = {
  baseUrl: 'https://au-api.basiq.io',
  auth: {
    apiKey: '',
  },
};

export class Client {
  private options: BasiqAPIOptions;
  private token: JwtToken;
  private request: axios.AxiosInstance;

  constructor(opts: BasiqAPIOptions) {
    this.options = Object.assign({}, DEFAULTS, opts);

    if (!this.options.auth.apiKey.length) {
      log('API Key not passed to constructor');
      throw new Error('API Key must be passed');
    }

    this.request = axios.default.create({
      baseURL: this.options.baseUrl,
      headers: {
        'User-Agent': userAgent,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    this.setBaseUrl(this.options.baseUrl);
  }

  setBaseUrl(baseUrl: string = ''): Client {
    if (baseUrl.length && baseUrl.slice(-1) === '/') {
      baseUrl = baseUrl.replace(/\/$/, '');
    }

    this.options.baseUrl = baseUrl;
    this.request.defaults.baseURL = this.options.baseUrl;

    return this;
  }

  formatResponse(res: axios.AxiosResponse): BasiqResponse {
    return {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      body: res.data,
    };
  }

  async get(url: string, config?: axios.AxiosRequestConfig): Promise<axios.AxiosResponse> {
    config = await this.prepareConfig(config);
    log('Prepared Config', config);
    return await this.request
      .get(this.prependSlash(url), config)
      ;
  }

  async post(url: string, data?: any, config?: axios.AxiosRequestConfig): Promise<axios.AxiosResponse> {
    config = await this.prepareConfig(config);
    return await this.request
      .post(this.prependSlash(url), data, config)
      ;
  }

  async put(url: string, data?: any, config?: axios.AxiosRequestConfig): Promise<axios.AxiosResponse> {
    config = await this.prepareConfig(config);
    return await this.request
      .put(this.prependSlash(url), data, config)
      ;
  }

  async delete(url: string, config?: axios.AxiosRequestConfig): Promise<axios.AxiosResponse> {
    config = await this.prepareConfig(config);
    return await this.request
      .delete(this.prependSlash(url), config)
      ;
  }

  private prependSlash(url: string = ''): string {
    if (url.length && url[0] !== '/') {
      url = `/${url}`;
    }
    return url;
  }

  private async authenticate(): Promise<axios.AxiosResponse> {
    log('Authenticating');
    const data = {
      'grant_type': 'client_credentials',
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Basic ${this.options.auth.apiKey}`,
    };

    const res = await this.request
      .post(`/oauth2/token`, querystring.stringify(data), { headers });
    // Save Access Token
    this.token = res.data;
    log('Set this.', this.token);
    return res;
  }

  private async checkToken(): Promise<JwtToken> {
    let haveValidToken = false;

    if (this.token) {
      const decodedAccessToken = decode(this.token.access_token) as JwtTokenDecoded;
      const tokenExpiration = new Date(decodedAccessToken.payload.exp * 1000);
      haveValidToken = (new Date()).getTime() <= tokenExpiration.getTime();

      log('Token valid?', haveValidToken ? 'Yes' : 'No');
    } else {
      log('No token');
    }


    if (!haveValidToken) {
      log('Refreshing token');
      await this.authenticate();
    } else {
      return this.token;
    }
  }

  private async setCommonHeaders(config?: axios.AxiosRequestConfig): Promise<axios.AxiosRequestConfig> {
    await this.checkToken();
    log('Setting Headers');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': (this.token ? `${this.token.token_type} ${this.token.access_token}` : ''),
    };
    return Object.assign({}, { headers }, config);
  }

  private async prepareConfig(config?: axios.AxiosRequestConfig): Promise<axios.AxiosRequestConfig> {
    return this.setCommonHeaders(config);
  }


}
