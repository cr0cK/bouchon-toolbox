/* eslint func-names: 0 */
/* eslint no-unused-expressions: 0 */

import chai from 'chai';

import { selectRow, extendRows } from './helpers';


const expect = chai.expect;

describe('Selectors helpers', () => {
  describe('selectRow()', function() {
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

    it('returns an object if a row matchs', () => {
      const row = selectRow(this.dummySelector, 'name', 'Obrien')(this.rows);

      expect(row).to.deep.equal({
        id: 'caa3eb5a-a0c5-4a48-b195-88a104471a6f',
        vat_number: 'FR737217459',
        name: 'Obrien',
        siren: 745609300,
      });
    });

    it('returns an array of objects if several match', () => {
      const row = selectRow(this.dummySelector, 'name', 'Obrien')(this.rowsWithDuplicates);

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
      const row = selectRow(this.dummySelector, 'name', 'blabla')(this.rows);

      expect(row).to.be.undefined;
    });

    it('returns an error if an arg is invalid', () => {
      expect(selectRow(undefined, 'name', 'blabla')(this.rows)).to.be.equal('Bad arguments for `selectRow`');
      expect(selectRow(this.dummySelector, undefined, 'blabla')(this.rows)).to.be.equal('Bad arguments for `selectRow`');
      expect(selectRow(this.dummySelector, 'name', undefined)(this.rows)).to.be.equal('Bad arguments for `selectRow`');
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
        () => state => state.articles,
        'authorId',
        () => state => state.authors,
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
        () => state => state.articles,
        'authorCustomId',
        () => state => state.authors,
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
      expect(extendRows(undefined)(this.rows)).to.be.equal('Bad arguments for `extendRows`');
    });
  });
});
