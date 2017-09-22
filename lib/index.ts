import * as debug from 'debug';
import * as jwtdecode from 'jwt-decode';
import * as request from 'superagent';
import * as superagentPrefix from 'superagent-prefix';

import { BasiqApiError } from './error';
import { AuthenticationOptions, BasiqAPIOptions, JwtToken } from './interfaces';

const log = debug('basiq-api');

export class BasiqAPI {
  private token: JwtToken;
  private request: request.SuperAgentStatic;
  private prefix: request.Plugin;

  options: BasiqAPIOptions;

  constructor(opts: BasiqAPIOptions) {
    this.request = request;

    this.options = opts;

    // Remove trailing slash from Base URL
    this.options.baseURL = this.options.baseURL.replace(/\/$/, '');
    this.prefix = superagentPrefix(this.options.baseURL);
  }

  private async getNewToken(): Promise<JwtToken> {
    return await request
      .post(`/oauth2/token`)
      .use(this.prefix)
      .send({
        'grant_type': 'client_credentials'
      })
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${this.options.auth.apiKey}`
      })
      .then(res => res.body as JwtToken)
      .catch((error) => {
        if (error && error.response) {
          log('Basiq API Error', {
            status: error.status,
            message: error.message,
            body: error.response.body
          });

          throw new BasiqApiError(error.status, error.message, error.response);
        } else throw error;
      })
      ;
  }

  private async refreshTokenIfExpired() {

    const updateToken = async () => {
      await this.getNewToken()
        .then((token: JwtToken) => this.token = token)
        .catch(error => { throw error })
        ;
    }

    if (this.token) {
      const decodedAccessToken: JwtToken = jwtdecode(this.token.access_token) as JwtToken;
      const tokenExpiration = new Date(decodedAccessToken.expires_in * 1000);
      if ((new Date()).getTime() > tokenExpiration.getTime()) {
        log(`Token has expired; Fetch new`);
        await updateToken()
          .catch(error => { throw error })
          ;
      }
    } else {
      log(`No token; Fetch new`);
      await updateToken()
        .catch(error => { throw error })
        ;
    }
  }

  async authenticate(auth?: AuthenticationOptions): Promise<JwtToken> {
    this.options.auth = auth || this.options.auth;
    return await this
      .refreshTokenIfExpired()
      .then(() => log('Got auth token', this.token))
      .then(() => this.token)
      .catch(error => { throw error })
      ;
  }


}