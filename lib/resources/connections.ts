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

  refresh(connectionId: string): BasiqPromise {
    return this.client
      .post(`connections/${connectionId}/refresh`)
      .then(res => this.client.formatResponse(res))
      ;
  }

  retrieve(connectionId: string): BasiqPromise {
    return this.client
      .get(`connections/${connectionId}`)
      .then(res => this.client.formatResponse(res))
      ;
  }

  update(connectionId: string, options: ConnectionUpdateOptions): BasiqPromise {
    return this.client
      .put(`connections/${connectionId}`, options)
      .then(res => this.client.formatResponse(res))
      ;
  }

  delete(connectionId: string): BasiqPromise {
    return this.client
      .delete(`connections/${connectionId}`)
      .then(res => this.client.formatResponse(res))
      ;
  }

}

export { Connection };
