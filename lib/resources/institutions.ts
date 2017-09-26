import * as debug from 'debug';

import { Client } from '../client';
import { BasiqPromise } from '../interfaces';
import { Resource } from './resource';

const log = debug('basiq-api:resource:institution');

class Institution extends Resource {

  constructor(client: Client) {
    super(client);
  }

  retrieve(institutionId: string): BasiqPromise {
    if (!institutionId) {
      throw new Error('Institution ID is a required parameter');
    }

    return this.fetch(institutionId);
  }

  list(): BasiqPromise {
    return this.fetch();
  }

  private fetch(institutionId: string = ''): BasiqPromise {
    return this.client
      .get(`institutions/${institutionId}`)
      .then(res => this.client.formatResponse(res))
      ;
  }

}

export { Institution };
