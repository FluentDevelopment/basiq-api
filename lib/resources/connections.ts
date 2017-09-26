import * as debug from 'debug';

import { Client } from '../client';
import { BasiqPromise, ConnectionCreateOptions, ConnectionUpdateOptions } from '../interfaces';
import { Resource } from './resource';

const log = debug('basiq-api:resource:connection');

class Connection extends Resource {

  constructor(client: Client) {
    super(client);
  }

  create(options: ConnectionCreateOptions): BasiqPromise {
    return this.client
      .post('connections', options)
      .then(res => this.client.formatResponse(res))
      ;
  }

  refresh(id: string): BasiqPromise {
    return this.client
      .post(`connections/${id}/refresh`)
      .then(res => this.client.formatResponse(res))
      ;
  }

  retrieve(id: string): BasiqPromise {
    return this.client
      .get(`connections/${id}`)
      .then(res => this.client.formatResponse(res))
      ;
  }

  update(id: string, options: ConnectionUpdateOptions): BasiqPromise {
    return this.client
      .put(`connections/${id}`, options)
      .then(res => this.client.formatResponse(res))
      ;
  }

  delete(id: string): BasiqPromise {
    return this.client
      .delete(`connections/${id}`)
      .then(res => this.client.formatResponse(res))
      ;
  }

}

export { Connection };
