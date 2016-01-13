/* eslint func-names: 0 */
/* eslint no-unused-expressions: 0 */

import chai from 'chai';

import { filterRow, filterRows } from './filterRows';
import { extendRows } from './extendRows';


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

  describe('extendRow()', function() {
    this.dummySelector = () => state => state;

    const articles = [{
      'id': 1,
      'title': 'cillum eu esse',
      'body': 'Culpa in duis mollit ullamco minim quis ullamco eu. Veniam duis consequat ad veniam commodo. Labore laboris commodo aliquip ad labore non. Sit commodo nostrud id voluptate voluptate magna exercitation eu occaecat officia pariatur. Enim adipisicing quis fugiat et do esse non mollit. Officia exercitation irure culpa anim excepteur minim dolore duis.',
      'date_created': 'Tuesday, October 20, 2015 2:34 PM',
      'authorId': 1,
      'authorCustomId': '1-blah',
    }, {
      'id': 2,
      'title': 'voluptate labore cillum',
      'body': 'Veniam tempor mollit qui do quis ex. Anim fugiat adipisicing officia eiusmod. Excepteur adipisicing consequat veniam occaecat sint eu nulla. Labore adipisicing quis qui nulla tempor aute laboris. Adipisicing non dolor consectetur ipsum cupidatat ut veniam. Labore ullamco est ullamco magna irure sit.',
      'date_created': 'Thursday, October 23, 2014 1:34 PM',
      'authorId': 2,
      'authorCustomId': '2-blah',
    }];

    const authors = [{
      'last': 'Hodges',
      'first': 'Jamie',
      'id': 1,
    }, {
      'last': 'Tanner',
      'first': 'Pope',
      'id': 2,
    }];

    it('returns the list of articles with their author', () => {
      const rows = extendRows(
        state => state.articles,
        'authorId',
        state => state.authors,
        'id',
        'author'
      )({ articles, authors });

      expect(rows).to.deep.equal([{
        id: 1,
        title: 'cillum eu esse',
        body: 'Culpa in duis mollit ullamco minim quis ullamco eu. Veniam duis consequat ad veniam commodo. Labore laboris commodo aliquip ad labore non. Sit commodo nostrud id voluptate voluptate magna exercitation eu occaecat officia pariatur. Enim adipisicing quis fugiat et do esse non mollit. Officia exercitation irure culpa anim excepteur minim dolore duis.',
        date_created: 'Tuesday, October 20, 2015 2:34 PM',
        authorId: 1,
        authorCustomId: '1-blah',
        author: {
          last: 'Hodges',
          first: 'Jamie',
          id: 1,
        },
      }, {
        id: 2,
        title: 'voluptate labore cillum',
        body: 'Veniam tempor mollit qui do quis ex. Anim fugiat adipisicing officia eiusmod. Excepteur adipisicing consequat veniam occaecat sint eu nulla. Labore adipisicing quis qui nulla tempor aute laboris. Adipisicing non dolor consectetur ipsum cupidatat ut veniam. Labore ullamco est ullamco magna irure sit.',
        date_created: 'Thursday, October 23, 2014 1:34 PM',
        authorId: 2,
        authorCustomId: '2-blah',
        author: {
          last: 'Tanner',
          first: 'Pope',
          id: 2,
        },
      }]);
    });

    it('returns the list of articles with their author by using a custom predicate function', () => {
      const predicate = (row1, key1, row2, key2) => {
        const authorId = row1[key1].match(/^(\d+)/).pop();
        return Number(authorId) === Number(row2[key2]);
      };

      const rows = extendRows(
        state => state.articles,
        'authorCustomId',
        state => state.authors,
        'id',
        'author',
        predicate,
      )({ articles, authors });

      expect(rows).to.deep.equal([{
        id: 1,
        title: 'cillum eu esse',
        body: 'Culpa in duis mollit ullamco minim quis ullamco eu. Veniam duis consequat ad veniam commodo. Labore laboris commodo aliquip ad labore non. Sit commodo nostrud id voluptate voluptate magna exercitation eu occaecat officia pariatur. Enim adipisicing quis fugiat et do esse non mollit. Officia exercitation irure culpa anim excepteur minim dolore duis.',
        date_created: 'Tuesday, October 20, 2015 2:34 PM',
        authorId: 1,
        authorCustomId: '1-blah',
        author: {
          last: 'Hodges',
          first: 'Jamie',
          id: 1,
        },
      }, {
        id: 2,
        title: 'voluptate labore cillum',
        body: 'Veniam tempor mollit qui do quis ex. Anim fugiat adipisicing officia eiusmod. Excepteur adipisicing consequat veniam occaecat sint eu nulla. Labore adipisicing quis qui nulla tempor aute laboris. Adipisicing non dolor consectetur ipsum cupidatat ut veniam. Labore ullamco est ullamco magna irure sit.',
        date_created: 'Thursday, October 23, 2014 1:34 PM',
        authorId: 2,
        authorCustomId: '2-blah',
        author: {
          last: 'Tanner',
          first: 'Pope',
          id: 2,
        },
      }]);
    });

    it('returns an error if an arg is invalid', () => {
      expect(function() {
        extendRows(undefined)(this.rows);
      }).to.throw(/arguments/);
    });
  });

});
