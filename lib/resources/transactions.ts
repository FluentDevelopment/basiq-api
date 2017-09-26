import * as debug from 'debug';

import { Client } from '../client';
import { BasiqPromise } from '../interfaces';
import { Resource } from './resource';

const log = debug('basiq-api:resource:transaction');

const fetch = (client: Client, connectionId: string, transactionId: string = ''): BasiqPromise => {
  return client
    .get(`connections/${connectionId}/transactions/${transactionId}`)
    .then(res => client.formatResponse(res))
    ;
};

class Transaction extends Resource {

  constructor(client: Client) {
    super(client);
  }

  retrieve(connectionId: string, transactionId: string): BasiqPromise {
    if (!connectionId) {
      return this.error('Connection ID is a required parameter');
    }

    if (!transactionId) {
      return this.error('Transaction ID is a required parameter');
    }

    return fetch(this.client, connectionId, transactionId);
  }

  list(connectionId: string): BasiqPromise {
    if (!connectionId) {
      return this.error('Connection ID is a required parameter');
    }

    return fetch(this.client, connectionId);
  }

}

export { Transaction };
