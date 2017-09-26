import * as debug from 'debug';

import { Client } from '../client';
import { BasiqPromise } from '../interfaces';
import { Resource } from './resource';

const log = debug('basiq-api:resource:institution');

const fetch = (client: Client, institutionId: string = ''): BasiqPromise => {
  return client
    .get(`institutions/${institutionId}`)
    .then(res => client.formatResponse(res))
    ;
};

class Institution extends Resource {

  constructor(client: Client) {
    super(client);
  }

  retrieve(institutionId: string): BasiqPromise {
    if (!institutionId) {
      throw new Error('Institution ID is a required parameter');
    }

    return fetch(this.client, institutionId);
  }

  list(): BasiqPromise {
    return fetch(this.client);
  }

}

export { Institution };
