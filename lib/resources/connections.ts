import * as debug from 'debug';

import { Client } from '../client';
import { ConnectionCreateOptions, ConnectionUpdateOptions } from '../interfaces';
import { Resource } from './resource';

const log = debug('basiq-api:resource:connection');

class Connection extends Resource {

  constructor(client: Client) {
    super(client);
  }

  create(options: ConnectionCreateOptions) {
    return this.client
      .post('connections', options)
      .then(res => this.client.formatResponse(res))
      ;
  }

  refresh(connectionId: string) {
    return this.client
      .post(`connections/${connectionId}/refresh`)
      .then(res => this.client.formatResponse(res))
      ;
  }

  retrieve(connectionId: string) {
    return this.client
      .get(`connections/${connectionId}`)
      .then(res => this.client.formatResponse(res))
      ;
  }

  update(connectionId: string, options: ConnectionUpdateOptions) {
    return this.client
      .put(`connections/${connectionId}`, options)
      .then(res => this.client.formatResponse(res))
      ;
  }

  delete(connectionId: string) {
    return this.client
      .delete(`connections/${connectionId}`)
      .then(res => this.client.formatResponse(res))
      ;
  }

}

export { Connection };
