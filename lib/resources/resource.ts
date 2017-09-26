import { Client } from '../client';
import { BasiqPromise } from '../interfaces';

export class Resource {
  protected readonly client: Client;
  constructor(client: Client) {
    Object.defineProperty(this, 'client', {
      value: client,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }

  error(message: string): BasiqPromise {
    return new Promise((resolve, reject) => reject(message));
  }
}
