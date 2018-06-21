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

  beforeEach(() => {
    nock.cleanAll();

    Helper.mockAuthRoute();
  });

  it('should create', () => {
    resource = new Transaction(client);
    expect(resource).to.an('object');
  });

  describe('Methods', () => {

    beforeEach(() => {
      resource = new Transaction(client);
    });

    describe('List', () => {
      let transactionsEndpoint: nock.Scope;

      beforeEach(() => {
        transactionsEndpoint = nock(Helper.baseUrl)
          .get(`/connections/${CONNECTION_ID}/transactions`)
          .reply(200, { accounts: [] })
          ;
      });

      it('should list', async () => {
        await assert.isFulfilled(resource.list(CONNECTION_ID));
        assert.isTrue(transactionsEndpoint.isDone());
      });

      it('should throw error if Connection ID is not passed', async () => {
        await assert.isRejected(resource.list(undefined), /Connection ID/);
        assert.isFalse(transactionsEndpoint.isDone());
      });

    });

    describe('Retrieve', () => {
      let transactionListEndpoint: nock.Scope;
      let transactionRetrieveEndpoint: nock.Scope;

      beforeEach(() => {

        transactionListEndpoint = nock(Helper.baseUrl)
          .get(`/connections/${CONNECTION_ID}/transactions/`)
          .reply(200, { accounts: [] })
          ;

        transactionRetrieveEndpoint = nock(Helper.baseUrl)
          .get(`/connections/${CONNECTION_ID}/transactions/${TRANSACTION_ID}`)
          .reply(200, { id: TRANSACTION_ID })
          ;
      });

      it('should retrieve', async () => {
        await assert.isFulfilled(resource.retrieve(CONNECTION_ID, TRANSACTION_ID));
        assert.isTrue(transactionRetrieveEndpoint.isDone());
        assert.isFalse(transactionListEndpoint.isDone());
      });

      it('should throw error if Connection ID is not passed', async () => {
        await assert.isRejected(resource.retrieve(undefined, undefined), /Connection ID/);
        assert.isFalse(transactionRetrieveEndpoint.isDone());
        assert.isFalse(transactionListEndpoint.isDone());
      });

      it('should throw error if Transaction ID is not passed', async () => {
        await assert.isRejected(resource.retrieve(CONNECTION_ID, undefined), /Transaction ID/);
        assert.isFalse(transactionRetrieveEndpoint.isDone());
        assert.isFalse(transactionListEndpoint.isDone());
      });

    });

  });

});
