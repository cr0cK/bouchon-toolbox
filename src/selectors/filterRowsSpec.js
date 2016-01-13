/* eslint func-names: 0 */
/* eslint no-unused-expressions: 0 */

import chai from 'chai';

import { filterRow, filterRows } from './filterRows';


const expect = chai.expect;

describe('Filter selectors', () => {
  describe('filterRow()', function() {
    this.dummySelector = () => state => state;

    this.rows = [{
      'last': 'Zimmerman',
      'first': 'Fay',
      'index': 1,
    }, {
      'last': 'Craft',
      'first': 'Juliette',
      'index': 2,
    }, {
      'last': 'Combs',
      'first': 'Fay',
      'index': 3,
    }];

    it('returns an empty object if no row matchs', () => {
      const row = filterRow(this.dummySelector(), 'first', 'Obrien')(this.rows);

      expect(row).to.deep.equal({});
    });

    it('returns an object if one row matchs', () => {
      const row = filterRow(this.dummySelector(), 'last', 'Zimmerman')(this.rows);

      expect(row).to.deep.equal({
        'last': 'Zimmerman',
        'first': 'Fay',
        'index': 1,
      });
    });

    it('throw an error if several rows match', () => {
      expect(function test() {
        filterRow(this.dummySelector(), 'first', 'Fay')(this.rows);
      }.bind(this)).to.throw(/Your selector should not return more than 1 row/);
    });

    it('throws some errors if an argument is invalid', () => {
      expect(function() {
        filterRows(undefined, 'first', 'blabla')(this.rows);
      }.bind(this)).to.throw(/function/);

      expect(function() {
        filterRows(this.dummySelector(), undefined, 'blabla')(this.rows);
      }.bind(this)).to.throw(/string/);

      expect(function() {
        filterRows(this.dummySelector(), 'first', undefined)(this.rows);
      }.bind(this)).to.throw(/defined/);
    });
  });

  describe('filterRows()', function() {
    this.dummySelector = () => state => state;

    this.rows = [{
      'last': 'Zimmerman',
      'first': 'Fay',
      'index': 1,
    }, {
      'last': 'Craft',
      'first': 'Juliette',
      'index': 2,
    }, {
      'last': 'Combs',
      'first': 'Fay',
      'index': 3,
    }];

    it('returns an empty array if no row matchs', () => {
      const row = filterRows(this.dummySelector(), 'first', 'Obrien')(this.rows);

      expect(row).to.deep.equal([]);
    });

    it('returns an array of one item if one row matchs', () => {
      const row = filterRows(this.dummySelector(), 'last', 'Zimmerman')(this.rows);

      expect(row).to.deep.equal([{
        'last': 'Zimmerman',
        'first': 'Fay',
        'index': 1,
      }]);
    });

    it('returns an array of n items if several row matchs', () => {
      const row = filterRows(this.dummySelector(), 'first', 'Fay')(this.rows);

      expect(row).to.deep.equal([{
        'last': 'Zimmerman',
        'first': 'Fay',
        'index': 1,
      }, {
        'last': 'Combs',
        'first': 'Fay',
        'index': 3,
      }]);
    });

    it('throws some errors if an argument is invalid', () => {
      expect(function() {
        filterRows(undefined, 'first', 'blabla')(this.rows);
      }.bind(this)).to.throw(/function/);

      expect(function() {
        filterRows(this.dummySelector(), undefined, 'blabla')(this.rows);
      }.bind(this)).to.throw(/string/);

      expect(function() {
        filterRows(this.dummySelector(), 'first', undefined)(this.rows);
      }.bind(this)).to.throw(/defined/);
    });
  });
});
