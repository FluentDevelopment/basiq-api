import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as nock from 'nock';

import { Client } from '../lib/client';
import { Connection } from '../lib/resources/connections';
import { Helper } from './helper';


chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;

const CONNECTION_ID = '1';

const client: Client = new Client(Helper.authOptions.valid);
let resource: Connection;

describe('Connection', () => {

  beforeEach(done => {
    nock.cleanAll();

    Helper.mockAuthRoute();

    done();
  });

  it('should create', () => {
    resource = new Connection(client);
    expect(resource).to.an('object');
  });

  describe('Methods', () => {

    beforeEach(done => {
      resource = new Connection(client);

      done();
    });

    describe('Create', () => {

      beforeEach(done => {
        nock(Helper.baseUrl)
          .persist()
          .post(`/connections`)
          .reply(200, {})
          ;

        done();
      });

      it('should create', () =>
        assert.isFulfilled(resource.create(Helper.connectionCreateOptions)),
      );

    });

    describe('Refresh', () => {

      beforeEach(done => {
        nock(Helper.baseUrl)
          .persist()
          .post(`/connections/${CONNECTION_ID}/refresh`)
          .reply(200, {})
          ;

        done();
      });

      it('should refresh', () =>
        assert.isFulfilled(resource.refresh(CONNECTION_ID)),
      );

    });

    describe('Retrieve', () => {

      beforeEach(done => {
        nock(Helper.baseUrl)
          .persist()
          .get(`/connections/${CONNECTION_ID}`)
          .reply(200, {})
          ;

        done();
      });

      it('should retrieve', () =>
        assert.isFulfilled(resource.retrieve(CONNECTION_ID)),
      );

    });

    describe('Update', () => {

      beforeEach(done => {
        nock(Helper.baseUrl)
          .persist()
          .put(`/connections/${CONNECTION_ID}`)
          .reply(200, {})
          ;

        done();
      });

      it('should update', () =>
        assert.isFulfilled(resource.update(CONNECTION_ID, Helper.connectionUpdateOptions)),
      );

    });

    describe('Delete', () => {

      beforeEach(done => {
        nock(Helper.baseUrl)
          .persist()
          .delete(`/connections/${CONNECTION_ID}`)
          .reply(200, {})
          ;

        done();
      });

      it('should delete', () =>
        assert.isFulfilled(resource.delete(CONNECTION_ID)),
      );

    });

  });

});
