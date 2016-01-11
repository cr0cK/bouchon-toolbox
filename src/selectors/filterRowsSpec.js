/* eslint func-names: 0 */
/* eslint no-unused-expressions: 0 */

import chai from 'chai';

import { filterRows } from './filterRows';


const expect = chai.expect;

describe('filterRows()', function() {
  this.dummySelector = () => state => state;

  this.rows = [{
    id: 'caa3eb5a-a0c5-4a48-b195-88a104471a6f',
    vat_number: 'FR737217459',
    name: 'Obrien',
    siren: 745609300,
  }, {
    id: 'fb4a33bd-3eac-4c0a-bade-cbe27362ce5e',
    vat_number: 'FR821490886',
    name: 'Flynn',
    siren: 270751769,
  }, {
    id: '8ff86eae-2d3c-47b1-a00a-966085409e54',
    vat_number: 'FR570244964',
    name: 'Le',
    siren: 85922729,
  }];

  this.rowsWithDuplicates = [{
    id: 'caa3eb5a-a0c5-4a48-b195-88a104471a6f',
    vat_number: 'FR737217459',
    name: 'Obrien',
    siren: 745609300,
  }, {
    id: 'fb4a33bd-3eac-4c0a-bade-cbe27362ce5e',
    vat_number: 'FR821490886',
    name: 'Obrien',
    siren: 270751769,
  }, {
    id: '8ff86eae-2d3c-47b1-a00a-966085409e54',
    vat_number: 'FR570244964',
    name: 'Le',
    siren: 85922729,
  }];

  it('returns an object if only one row matchs', () => {
    const row = filterRows(this.dummySelector(), 'name', 'Obrien')(this.rows);

    expect(row).to.deep.equal({
      id: 'caa3eb5a-a0c5-4a48-b195-88a104471a6f',
      vat_number: 'FR737217459',
      name: 'Obrien',
      siren: 745609300,
    });
  });

  it('returns an array if ouput type is Array and is only one row matchs', () => {
    const row = filterRows(this.dummySelector(), 'name', 'Obrien', Array)(this.rows);

    expect(row).to.deep.equal([{
      id: 'caa3eb5a-a0c5-4a48-b195-88a104471a6f',
      vat_number: 'FR737217459',
      name: 'Obrien',
      siren: 745609300,
    }]);
  });

  it('returns an array of objects if several match', () => {
    const row = filterRows(this.dummySelector(), 'name', 'Obrien')(this.rowsWithDuplicates);

    expect(row).to.deep.equal([{
      id: 'caa3eb5a-a0c5-4a48-b195-88a104471a6f',
      vat_number: 'FR737217459',
      name: 'Obrien',
      siren: 745609300,
    }, {
      id: 'fb4a33bd-3eac-4c0a-bade-cbe27362ce5e',
      vat_number: 'FR821490886',
      name: 'Obrien',
      siren: 270751769,
    }]);
  });

  it('returns undefined if it doesnt match', () => {
    const row = filterRows(this.dummySelector(), 'name', 'blabla')(this.rows);

    expect(row).to.be.undefined;
  });

  it('throws some errors if an argument is invalid', () => {
    const dummySelector = () => state => state;

    expect(function() {
      filterRows(undefined, 'name', 'blabla')(this.rows);
    }).to.throw(/function/);

    expect(function() {
      filterRows(dummySelector(), undefined, 'blabla')(this.rows);
    }).to.throw(/string/);

    expect(function() {
      filterRows(dummySelector(), 'name', undefined)(this.rows);
    }).to.throw(/defined/);
  });
});
