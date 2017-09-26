import { Client } from '../client';
import { BasiqPromise } from '../interfaces';

export class Resource {
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  error(message: string): BasiqPromise {
    return new Promise((resolve, reject) => reject(message));
  }
}
