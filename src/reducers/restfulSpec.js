import chai from 'chai';
import SchemaObject from 'node-schema-object';

import { retrieve, create, updateOrCreate, update, delete_ } from './restful';


const expect = chai.expect;

describe('restful reducer', () => {
  describe('retrieve()', () => {
    it('retrieves and sort data', () => {
      const state = [{
        id: 3,
        title: 'title3',
      }, {
        id: 2,
        title: 'title2',
      }];

      expect(retrieve(state)).to.deep.equal([{
        id: 2,
        title: 'title2',
      }, {
        id: 3,
        title: 'title3',
      }]);
    });
  });

  describe('create()', () => {
    it('creates a new entity in the state', () => {
      const state = [{
        id: 1,
        title: 'title1',
      }];

      const body = { title: 'title2' };
      const Post = new SchemaObject({
        id: Number,
        title: String,
      });

      const newState = create(state, body, Post);

      expect(newState).to.deep.equal([
        {
          id: 1,
          title: 'title1',
        }, {
          id: 2,
          title: 'title2',
        }]
      );
    });

    it('increments correctly the id key', () => {
      const state = [{
        numPost: 6,
        title: 'title1',
      }];

      const body = { title: 'title2' };
      const Post = new SchemaObject({
        numPost: Number,
        title: String,
      });
      const idKey = 'numPost';

      const newState = create(state, body, Post, idKey);

      expect(newState).to.deep.equal([
        {
          numPost: 6,
          title: 'title1',
        }, {
          numPost: 7,
          title: 'title2',
        }]
      );
    });

    it('doesnt add an id if not present', () => {
      const state = [{
        title: 'title1',
      }];

      const body = { title: 'title2' };
      const Post = new SchemaObject({
        title: String,
      });

      const newState = create(state, body, Post);

      expect(newState).to.deep.equal([
        {
          title: 'title1',
        }, {
          title: 'title2',
        }]
      );
    });

    it('throws an exception if the id is provided', () => {
      expect(() => {
        const state = [{
          id: 2,
          title: 'title1',
        }];
        const body = {
          id: 2,
          title: 'title2',
        };
        const Post = new SchemaObject({
          id: Number,
          title: String,
        });

        expect(create(state, body, Post));
      }).to.throw(/body should not provide an id when creating an entity/);
    });
  });

  describe('delete_()', () => {
    it('deletes an entity in the state with the default predicate', () => {
      const state = [{
        id: 1,
        title: 'title1',
      }, {
        id: 2,
        title: 'title2',
      }];

      const params = { id: 1 };

      const newState = delete_(state, params);

      expect(newState).to.deep.equal([
        {
          id: 2,
          title: 'title2',
        }]
      );
    });

    it('deletes an entity in the state with a custom predicate', () => {
      const state = [{
        numPost: 1,
        title: 'title1',
      }, {
        numPost: 2,
        title: 'title2',
      }];

      const params = { numPost: 1 };
      const idKey = 'numPost';
      const predicate = (entity, body) => (
        Number(entity.numPost) === Number(body.numPost)
      );

      const newState = delete_(state, params, idKey, predicate);

      expect(newState).to.deep.equal([
        {
          numPost: 2,
          title: 'title2',
        }]
      );
    });

    it('deletes nothing is the predicate returns false', () => {
      const state = [{
        id: 3,
        title: 'title1',
      }, {
        id: 4,
        title: 'title2',
      }];

      const params = { id: 1 };

      const newState = delete_(state, params);

      expect(newState).to.deep.equal([
        {
          id: 3,
          title: 'title1',
        }, {
          id: 4,
          title: 'title2',
        }]
      );
    });
  });

  describe('updateOrCreate()', () => {
    it('creates a new entity in the state if the id key has not been found', () => {
      const state = [{
        num: 4,
        title: 'title4',
      }];

      const Post = new SchemaObject({
        num: Number,
        title: String,
      });

      const params = { num: 7 };
      const body = { title: 'title7' };
      const idKey = 'num';

      const newState = updateOrCreate(state, params, body, Post, idKey);

      expect(newState).to.deep.equal([
        {
          num: 4,
          title: 'title4',
        }, {
          num: 7,
          title: 'title7',
        }]
      );
    });

    it('updates an entity in the state if the id key has been found', () => {
      const state = [{
        num: 4,
        title: 'title4',
        body: 'body4',
      }, {
        num: 5,
        body: 'body5',
      }];

      const params = { num: 4 };
      const body = { title: 'title4 updated' };
      const Post = new SchemaObject({
        num: Number,
        title: String,
        body: String,
      });
      const idKey = 'num';

      const newState = updateOrCreate(state, params, body, Post, idKey);

      expect(newState).to.deep.equal([
        {
          num: 4,
          title: 'title4 updated',
          body: null,
        }, {
          num: 5,
          body: 'body5',
        }]
      );
    });

    it('throws an exception if the id is not provided in params', () => {
      expect(() => {
        const state = [{
          num: 2,
          title: 'title1',
        }];

        const params = {};
        const body = {
          title: 'title2',
        };
        const Post = new SchemaObject({
          num: Number,
          title: String,
        });
        const idKey = 'num';

        updateOrCreate(state, params, body, Post, idKey);
      }).to.throw(/Params should provide an id when updating an entity/);
    });
  });

  describe('update()', () => {
    it('updates an entity in the state if the id key has been found', () => {
      const state = [{
        num: 4,
        title: 'title4',
        body: 'body4',
      }, {
        num: 5,
        body: 'body5',
      }];

      const params = { num: 4 };
      const body = { title: 'title4 updated' };
      const Post = new SchemaObject({
        num: Number,
        title: String,
        body: String,
      });
      const idKey = 'num';

      const newState = update(state, params, body, Post, idKey);

      expect(newState).to.deep.equal([
        {
          num: 4,
          title: 'title4 updated',
          body: 'body4',
        }, {
          num: 5,
          body: 'body5',
        }]
      );
    });

    it('throws an exception if the id is not provided in params', () => {
      expect(() => {
        const state = [{
          num: 2,
          title: 'title1',
        }];

        const params = {};
        const body = {
          title: 'title2',
        };
        const Post = new SchemaObject({
          num: Number,
          title: String,
        });
        const idKey = 'num';

        update(state, params, body, Post, idKey);
      }).to.throw(/Params should provide an id when updating an entity/);
    });
  });
});
