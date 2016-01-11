/* eslint no-console: 0 */

import _ from 'lodash';
import { createSelector } from 'reselect';


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
\`selectRow\` is deprecated. Please use \`selectRows\` instead.
Notice that \`selectRows\` doesn\'t call the selector by default, like \\createSelector\` from \`reselect\` does.
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

/**
 * Select row(s) from `selector` where the value of `key` is equal to `value`.
 *
 * @param  {Function}         Selector function (`createSelector` from reselect)
 * @param  {String}           Key
 * @param  {String | Number}  Value
 * @param  {Type}             Type of the output
 *                            (if undefined, return an array or an object)
 * @return {Function}         Selector
 */
export const selectRows = (selector, key, value, outputType) => {
  if (!_.isFunction(selector)) {
    throw new Error('`selector` should be a function.');
  }

  if (!_.isString(key)) {
    throw new Error('`key` should be a string.');
  }

  if (_.isUndefined(key)) {
    throw new Error('`value` should be defined.');
  }

  return createSelector(
    selector,
    rows => {
      let result = _.groupBy(rows, key)[value];

      if (_.isArray(result) && result.length === 1 && outputType !== Array) {
        result = result.pop();
      }

      return result;
    }
  );
};
