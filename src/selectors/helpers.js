/* eslint no-console: 0 */

import _ from 'lodash';
import { createSelector } from 'reselect';


/**
 * Select one or severals rows from `selector` if the key `key` is equal to
 * `value`.
 *
 * @param  {Function}         Selector function (from reselect)
 * @param  {String}           key
 * @param  {String | Number}  value
 * @return {Object | Array}
 */
export const selectRow = (selector, key, value) => {
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
 * Return the results of `selector1` extended with results of `selector2`
 * saved in `destKey` according to the predicate function (or string).

 * @param  {Function} selector1           Selector function
 * @param  {String} key1                  Key to compare in the first collection
 * @param  {Function} selector2           Selector function
 * @param  {String} ke2                   Key to compare in the second collection
 * @param  {String} destKey               The destination key in the first collection
 * @param  {Function | String} predicate  Optional custom comparison function
 * @return {Array}
 */
export const extendRows = (selector1, key1, selector2, key2, destKey, predicate) => {
  if (!_.isFunction(selector1) || !_.isFunction(selector2) ||
      !_.isString(key1) || !_.isString(key2) || !_.isString(destKey) ||
      (predicate !== undefined && !_.isFunction(predicate))) {
    return () => 'Bad arguments for `extendRows`';
  }

  let predicateFunction = predicate;

  if (_.isUndefined(predicateFunction)) {
    predicateFunction = (row1, key1_, row2, key2_) => {
      return Number(row1[key1_]) === Number(row2[key2_]);
    };
  }

  return createSelector(
    selector1(),
    selector2(),
    (rows1, rows2) => {
      return rows1.map(row1 => {
        const clonedRow1 = Object.assign({}, row1);
        clonedRow1[destKey] = rows2.filter(row2 => {
          return predicateFunction(row1, key1, row2, key2);
        }).pop();
        return clonedRow1;
      });
    },
  );
};
