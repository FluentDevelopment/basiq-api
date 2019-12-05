import * as debug from 'debug';

import { Client } from './client';
import { BasiqAPIOptions } from './interfaces';
import { Account } from './resources/accounts';
import { Connection } from './resources/connections';
import { Institution } from './resources/institutions';
import { Transaction } from './resources/transactions';

const log = debug('basiq-api');

export class BasiqAPI {

  public accounts: Account;

  public connections: Connection;

  public transactions: Transaction;

  public institutions: Institution;

  protected _client: Client;

  constructor(options: BasiqAPIOptions) {
    const client = new Client(options);

    const resources = {
      connections: Connection,
      accounts: Account,
      transactions: Transaction,
      institutions: Institution,
    };

    Object.defineProperty(this, '_client', {
      value: client,
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.keys(resources)
      .forEach((resource: string) => {
        Object.defineProperty(this, resource, {
          value: new resources[resource](this._client),
          writable: true,
          enumerable: false,
          configurable: true,
        });
      });
  }
}

export {
  BasiqAPIOptions,
  AuthenticationOptions,
  ConnectionCreateOptions,
  ConnectionUpdateOptions,
  BasiqResponse,
} from './interfaces';

