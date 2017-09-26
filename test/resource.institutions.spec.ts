import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as nock from 'nock';

import { Client } from '../lib/client';
import { Institution } from '../lib/resources/institutions';
import { Helper } from './helper';

chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;

const CONNECTION_ID = '1';
const INSTITUTION_ID = '2';

const client: Client = new Client(Helper.authOptions);
let resource: Institution;

describe('Institution', () => {

  beforeEach(done => {
    nock.cleanAll();

    Helper.mockAuthRoute();

    done();
  });

  it('should create', () => {
    resource = new Institution(client);
    expect(resource).to.an('object');
  });

  describe('Methods', () => {

    beforeEach(done => {
      resource = new Institution(client);
      done();
    });

    describe('List', () => {

      beforeEach(done => {
        nock(Helper.baseUrl)
          .persist()
          .get(`/institutions/`)
          .reply(200, {})
          ;

        done();
      });

      it('should list', () =>
        assert.isFulfilled(resource.list()),
      );

    });

    describe('Retrieve', () => {

      beforeEach(done => {
        nock(Helper.baseUrl)
          .persist()
          .get(`/institutions/${INSTITUTION_ID}`)
          .reply(200, {})
          ;

        done();
      });

      it('should retrieve', () =>
        assert.isFulfilled(resource.retrieve(INSTITUTION_ID)),
      );

    });

  });

});
