import * as debug from 'debug';

import { Client } from '../client';
import { Resource } from './resource';

const log = debug('basiq-api:resource:transaction');

const fetch = async (client: Client, connectionId: string, ...extraPaths: string[]) => {
  const url = ['connections', connectionId, 'transactions', ...extraPaths].join('/');
  const res = await client.get(url);
  return client.formatResponse(res);
};

class Transaction extends Resource {

  constructor(client: Client) {
    super(client);
  }

  retrieve(connectionId: string, transactionId: string) {
    if (!connectionId) {
      return this.error('Connection ID is a required parameter');
    }

    if (!transactionId) {
      return this.error('Transaction ID is a required parameter');
    }

    return fetch(this.client, connectionId, transactionId);
  }

  list(connectionId: string) {
    if (!connectionId) {
      return this.error('Connection ID is a required parameter');
    }

    return fetch(this.client, connectionId);
  }

}

export { Transaction };
