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

  beforeEach(() => {
    client = new Client(Helper.authOptions.valid);
  });

  it('should create', () => {
    client = new Client(Helper.authOptions.valid);
    expect(client).to.an('object');
  });

  it('should not create with empty API Key', () => {
    expect(() => new Client(Helper.authOptions.invalid)).to.throw(/API.*Key/);
  });

  describe('Valid Token', () => {

    beforeEach(() => {
      nock.cleanAll();

      Helper.mockAuthRoute();

      nock(Helper.baseUrl)
        .get('/')
        .reply(200, {});
    });

    it('should respond', () => assert.isFulfilled(client.get('/'))
      .then(() => assert.isTrue(nock.isDone())),
    );

    it('should remove trailing slash from base URL', () => {
      client = new Client(Helper.authOptions.baseUrlWithSlash);
      expect(client).to.an('object');
      return assert.isFulfilled(client.get('/'))
        .then(() => assert.isTrue(nock.isDone()));
    });

  });

  describe('Invalid token', () => {
    let auth;
    beforeEach(() => {
      nock.cleanAll();

      (client as any).token = Helper.getToken(false);

      Helper.mockAuthRoute(200);

      auth = nock(Helper.baseUrl)
        .get('/')
        .reply(200, {});
    });

    it('Should attempt to re-authenticate', () => {
      return assert.isFulfilled(client.get('/'))
        .then(() => assert.isTrue(auth.isDone()));
    });
  });

  describe('Authentication Error', () => {
    let auth, root;
    beforeEach(() => {
      nock.cleanAll();

      auth = Helper.mockAuthRoute(403);

      root = nock(Helper.baseUrl)
        .get('/')
        .reply(200, {});
    });

    it('should not respond', () => assert.isRejected(client.get('/'))
      .then(() => {
        assert.isTrue(auth.isDone());
        assert.isFalse(root.isDone());
      }),
    );

  });

});
