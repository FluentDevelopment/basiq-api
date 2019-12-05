import * as debug from 'debug';

import { Client } from '../client';
import { Resource } from './resource';

const log = debug('basiq-api:resource:account');

const fetch = async (client: Client, connectionId: string, accountId: string = '') => {
  const res = await client
    .get(`connections/${connectionId}/accounts/${accountId}`);
  return client.formatResponse(res);
};

class Account extends Resource {

  constructor(client: Client) {
    super(client);
  }

  retrieve(connectionId: string, accountId: string) {
    if (!connectionId) {
      return this.error('Connection ID is a required parameter');
    }

    if (!accountId) {
      return this.error('Account ID is a required parameter');
    }

    return fetch(this.client, connectionId, accountId);
  }

  list(connectionId: string) {
    if (!connectionId) {
      return this.error('Connection ID is a required parameter');
    }

    return fetch(this.client, connectionId);
  }

}

export { Account };
