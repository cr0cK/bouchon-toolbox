/* eslint no-console: 0 */

import _ from 'lodash';
import { createSelector } from 'reselect';


const checkInput = (selector, key, value) => {
  if (!_.isFunction(selector)) {
    throw new Error('`selector` should be a function.');
  }

  if (!_.isString(key)) {
    throw new Error('`key` should be a string.');
  }

  if (_.isUndefined(value)) {
    throw new Error('`value` should be defined.');
  }
};

/**
 * Filter the results of `selector` and return an object.
 * If several items match, it throws an error.
 *
 * @param  {Function}         Selector function (`createSelector` from reselect)
 * @param  {String}           Key
 * @param  {String | Number}  Value
 * @return {Function}         Selector
 */
export const filterRow = (selector, key, value) => {
  checkInput(selector, key, value);

  return createSelector(
    selector,
    rows => {
      const results = _.groupBy(rows, key)[value];
      let row;

      if (_.isUndefined(results)) {
        row = {};
      } else if (results.length === 1) {
        row = results.pop();
      } else if (!results.length) {
        row = {};
      } else {
        throw new Error('Your selector should not return more than 1 row.');
      }

      return row;
    }
  );
};

/**
 * Filter the results of `selector` and return an array.
 * If several items match, it throws an error.
 *
 * @param  {Function}         Selector function (`createSelector` from reselect)
 * @param  {String}           Key
 * @param  {String | Number}  Value
 * @return {Function}         Selector
 */
export const filterRows = (selector, key, value) => {
  checkInput(selector, key, value);

  return createSelector(
    selector,
    rows => _.groupBy(rows, key)[value] || []
  );
};

/**
 * DEPRECATED
 *
 * Select one or severals rows from `selector` if the key `key` is equal to
 * `value`.
 *
 * @param  {Function}         Selector function (`createSelector` from reselect)
 * @param  {String}           Key
 * @param  {String | Number}  Value
 * @return {Function}         Selector
 */
export const selectRow = (selector, key, value) => {
  console.info(`
\`selectRow\` is deprecated. Please use \`filterRows\` instead.
Notice that \`filterRows\` doesn\'t call the selector by default, like \\createSelector\` from \`reselect\` does.
`);

  if (_.isUndefined(selector) ||
      _.isUndefined(key) ||
      _.isUndefined(value)) {
    return () => 'Bad arguments for `selectRow`';
  }

  return createSelector(
    selector(),
    rows => {
      let result = _.groupBy(rows, key)[value];
      if (_.isArray(result) && result.length === 1) {
        result = result.pop();
      }
      return result;
    }
  );
};
