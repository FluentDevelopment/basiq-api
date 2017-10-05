import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as nock from 'nock';

import { Client } from '../lib/client';
import { Helper } from './helper';

chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;

let client: Client;

describe('Client', () => {

  beforeEach(done => {
    client = new Client(Helper.authOptions.valid);

    done();
  });

  it('should create', () => {
    client = new Client(Helper.authOptions.valid);
    expect(client).to.an('object');
  });

  it('should not create with empty API Key', () => {
    expect(() => new Client(Helper.authOptions.invalid)).to.throw(/API.*Key/);
  });

  describe('Valid Token', () => {

    beforeEach(done => {
      nock.cleanAll();

      Helper.mockAuthRoute();

      nock(Helper.baseUrl)
        .get('/')
        .reply(200, {});

      done();
    });

    it('should respond', () => assert.isFulfilled(client.get('/')));

    it('should remove trailing slash from base URL', () => {
      client = new Client(Helper.authOptions.baseUrlWithSlash);
      expect(client).to.an('object');
      assert.isFulfilled(client.get('/'));
    });

  });

  describe('Authentication Error', () => {

    beforeEach(done => {
      nock.cleanAll();

      Helper.mockAuthRoute(403);

      nock(Helper.baseUrl)
        .get('/')
        .reply(200, {});

      done();
    });

    it('should not respond', () => assert.isRejected(client.get('/')));

  });

});
