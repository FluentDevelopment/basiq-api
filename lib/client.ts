import * as axios from 'axios';
import * as debug from 'debug';
import { decode } from 'jws';
import * as querystring from 'qs';

import { BasiqAPIOptions, BasiqResponse, JwtToken, JwtTokenDecoded } from './interfaces';

const { name, version, homepage } = require('./../package.json');

const log = debug('basiq-api:client');

const userAgent = `${name.split('/').pop()}/${version} node/${process.version} (${homepage})`;
let options: BasiqAPIOptions;
let token: JwtToken;
let request: axios.AxiosInstance;
const DEFAULTS: BasiqAPIOptions = {
  baseUrl: 'https://au-api.basiq.io',
  auth: {
    apiKey: '',
  },
};

const prependSlash = (url: string = ''): string => {
  if (url.length && url[0] !== '/') {
    url = `/${url}`;
  }
  return url;
};

const authenticate = async (): Promise<axios.AxiosResponse> => {
  log('Authenticating');
  const data = {
    'grant_type': 'client_credentials',
  };

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    'Authorization': `Basic ${options.auth.apiKey}`,
  };

  return await request
    .post(`/oauth2/token`, querystring.stringify(data), { headers })
    .then(res => {
      // Save Access Token
      token = res.data;
      log('Set token', token);
      return res;
    })
    ;
};

const checkToken = async (): Promise<JwtToken> => {
  let haveValidToken = false;

  if (token) {
    const decodedAccessToken = decode(token.access_token) as JwtTokenDecoded;
    const tokenExpiration = new Date(decodedAccessToken.exp * 1000);
    haveValidToken = (new Date()).getTime() <= tokenExpiration.getTime();

    log('Token valid?', haveValidToken ? 'Yes' : 'No');
  } else {
    log('No token');
  }


  if (!haveValidToken) {
    log('Refreshing token');
    await authenticate()
      .then(res => token);
  } else {
    return token;
  }
};

const setCommonHeaders = async (config?: axios.AxiosRequestConfig): Promise<axios.AxiosRequestConfig> => {
  await checkToken();
  log('Setting Headers');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': (token ? `${token.token_type} ${token.access_token}` : ''),
  };
  return Object.assign({}, { headers }, config);
};

const prepareConfig = async (config?: axios.AxiosRequestConfig): Promise<axios.AxiosRequestConfig> => {
  await checkToken();
  return setCommonHeaders(config);
};

export class Client {

  constructor(opts: BasiqAPIOptions) {
    options = Object.assign({}, DEFAULTS, opts);

    if (!options.auth.apiKey.length) {
      log('API Key not passed to constructor');
      throw new Error('API Key must be passed');
    }

    request = axios.default.create({
      baseURL: options.baseUrl,
      headers: {
        'User-Agent': userAgent,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    this.setBaseUrl(options.baseUrl);
  }

  setBaseUrl(baseUrl: string = ''): Client {
    if (baseUrl.length && baseUrl.slice(-1) === '/') {
      baseUrl = baseUrl.replace(/\/$/, '');
    }

    options.baseUrl = baseUrl;
    request.defaults.baseURL = options.baseUrl;

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
    config = await prepareConfig(config);
    log('Prepared Config', config);
    return await request
      .get(prependSlash(url), config)
      ;
  }

  async post(url: string, data?: any, config?: axios.AxiosRequestConfig): Promise<axios.AxiosResponse> {
    config = await prepareConfig(config);
    return await request
      .post(prependSlash(url), data, config)
      ;
  }

  async put(url: string, data?: any, config?: axios.AxiosRequestConfig): Promise<axios.AxiosResponse> {
    config = await prepareConfig(config);
    return await request
      .put(prependSlash(url), data, config)
      ;
  }

  async delete(url: string, config?: axios.AxiosRequestConfig): Promise<axios.AxiosResponse> {
    config = await prepareConfig(config);
    return await request
      .delete(prependSlash(url), config)
      ;
  }
}
