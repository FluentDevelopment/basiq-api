import * as debug from 'debug';

import { Client } from '../client';
import { BasiqPromise } from '../interfaces';
import { Resource } from './resource';

const log = debug('basiq-api:resource:transaction');

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

    return this.fetch(connectionId, transactionId);
  }

  list(connectionId: string): BasiqPromise {
    if (!connectionId) {
      return this.error('Connection ID is a required parameter');
    }

    return this.fetch(connectionId);
  }

  private fetch(connectionId: string, transactionId: string = ''): BasiqPromise {
    return this.client
      .get(`connections/${connectionId}/transactions/${transactionId}`)
      .then(res => this.client.formatResponse(res))
      ;
  }

}

export { Transaction };
