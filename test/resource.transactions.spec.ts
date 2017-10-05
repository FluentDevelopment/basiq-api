import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as nock from 'nock';

import { Client } from '../lib/client';
import { Transaction } from '../lib/resources/transactions';
import { Helper } from './helper';

chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;

const CONNECTION_ID = '1';
const TRANSACTION_ID = '2';

const client: Client = new Client(Helper.authOptions.valid);
let resource: Transaction;

describe('Transaction', () => {

  beforeEach(done => {
    nock.cleanAll();

    Helper.mockAuthRoute();

    done();
  });

  it('should create', () => {
    resource = new Transaction(client);
    expect(resource).to.an('object');
  });

  describe('Methods', () => {

    beforeEach(done => {
      resource = new Transaction(client);
      done();
    });

    describe('List', () => {

      beforeEach(done => {
        nock(Helper.baseUrl)
          .persist()
          .get(`/connections/${CONNECTION_ID}/transactions/`)
          .reply(200, { accounts: [] })
          ;

        done();
      });

      it('should list', () =>
        assert.isFulfilled(resource.list(CONNECTION_ID)),
      );

      it('should throw error if Connection ID is not passed', () =>
        assert.isRejected(resource.list(undefined), /Connection ID/),
      );

    });

    describe('Retrieve', () => {

      beforeEach(done => {

        nock(Helper.baseUrl)
          .persist()
          .get(`/connections/${CONNECTION_ID}/transactions/`)
          .reply(200, { accounts: [] })
          ;

        nock(Helper.baseUrl)
          .persist()
          .get(`/connections/${CONNECTION_ID}/transactions/${TRANSACTION_ID}`)
          .reply(200, { id: TRANSACTION_ID })
          ;

        done();
      });

      it('should retrieve', () =>
        assert.isFulfilled(resource.retrieve(CONNECTION_ID, TRANSACTION_ID)),
      );

      it('should throw error if Connection ID is not passed', () =>
        assert.isRejected(resource.retrieve(undefined, undefined), /Connection ID/),
      );

      it('should throw error if Transaction ID is not passed', () =>
        assert.isRejected(resource.retrieve(CONNECTION_ID, undefined), /Transaction ID/),
      );

    });

  });

});
