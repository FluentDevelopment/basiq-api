import { Client } from '../client';
import { BasiqResponse } from '../interfaces';

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

  error(message: string) {
    return new Promise<BasiqResponse>((resolve, reject) => reject(message));
  }
}
