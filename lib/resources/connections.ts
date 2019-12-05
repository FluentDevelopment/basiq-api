import { AxiosResponse } from 'axios';
import * as debug from 'debug';

import { Client } from '../client';
import { ConnectionCreateOptions, ConnectionUpdateOptions } from '../interfaces';
import { Resource } from './resource';

const log = debug('basiq-api:resource:connection');

type ActionFunction = (client: Client, path: string) => Promise<AxiosResponse>;

const fetch = async (client: Client, action: ActionFunction, ...extraPaths: string[]) => {
  const url = ['connections', ...extraPaths].join('/');
  const res = await action(client, url);
  return client.formatResponse(res);
};

class Connection extends Resource {

  constructor(client: Client) {
    super(client);
  }

  create(options: ConnectionCreateOptions) {
    return fetch(this.client, (c, p) => c.post(p, options));
  }

  refresh(connectionId: string) {
    return fetch(this.client, (c, p) => c.post(p), connectionId, 'refresh');
  }

  retrieve(connectionId: string) {
    return fetch(this.client, (c, p) => c.get(p), connectionId);
  }

  update(connectionId: string, options: ConnectionUpdateOptions) {
    return fetch(this.client, (c, p) => c.put(p, options), connectionId);
  }

  delete(connectionId: string) {
    return fetch(this.client, (c, p) => c.delete(p), connectionId);
  }

}

export { Connection };
