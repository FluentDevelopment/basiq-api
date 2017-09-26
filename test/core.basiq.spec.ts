import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { Basiq } from '../lib';
import { Helper } from './helper';

chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;

let basiq;

describe('Basiq API', () => {

  it('should create', () => {
    basiq = Basiq(Helper.authOptions);
    expect(basiq).to.an('object');
  });

  describe('Properties', () => {
    beforeEach(done => {
      basiq = Basiq(Helper.authOptions);

      done();
    });

    it('should have connections property that is an object', () => {
      expect(basiq)
        .to.have.property('connections')
        .and.be.an('object')
        ;
    });

    it('should have accounts property that is an object', () => {
      expect(basiq)
        .to.have.property('accounts')
        .and.be.an('object')
        ;
    });

    it('should have transactions property that is an object', () => {
      expect(basiq)
        .to.have.property('transactions')
        .and.be.an('object')
        ;
    });

    it('should have institutions property that is an object', () => {
      expect(basiq)
        .to.have.property('institutions')
        .and.be.an('object')
        ;
    });

  });

});
