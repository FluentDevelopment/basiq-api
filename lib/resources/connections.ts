import * as debug from 'debug';

import { Client } from '../client';
import { ConnectionCreateOptions, ConnectionUpdateOptions } from '../interfaces';
import { Resource } from './resource';

const log = debug('basiq-api:resource:connection');

class Connection extends Resource {

  constructor(client: Client) {
    super(client);
  }

  async create(options: ConnectionCreateOptions) {
    const res = await this.client
      .post('connections', options);
    return this.client.formatResponse(res);
  }

  async refresh(connectionId: string) {
    const res = await this.client
      .post(`connections/${connectionId}/refresh`);
    return this.client.formatResponse(res);
  }

  async retrieve(connectionId: string) {
    const res = await this.client
      .get(`connections/${connectionId}`);
    return this.client.formatResponse(res);
  }

  async update(connectionId: string, options: ConnectionUpdateOptions) {
    const res = await this.client
      .put(`connections/${connectionId}`, options);
    return this.client.formatResponse(res);
  }

  async delete(connectionId: string) {
    const res = await this.client
      .delete(`connections/${connectionId}`);
    return this.client.formatResponse(res);
  }

}

export { Connection };
