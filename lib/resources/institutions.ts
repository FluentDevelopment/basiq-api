import * as debug from 'debug';

import { Client } from '../client';
import { Resource } from './resource';

const log = debug('basiq-api:resource:institution');

const fetch = async (client: Client, ...extraPaths: string[]) => {
  const url = ['institutions', ...extraPaths].join('/');
  const res = await client.get(url);
  return client.formatResponse(res);
};

class Institution extends Resource {

  constructor(client: Client) {
    super(client);
  }

  retrieve(institutionId: string) {
    if (!institutionId) {
      return this.error('Institution ID is a required parameter');
    }

    return fetch(this.client, institutionId);
  }

  list() {
    return fetch(this.client);
  }

}

export { Institution };
