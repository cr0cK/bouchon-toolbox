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
    return () => undefined;
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
 * @param  {Function} selector2           Selector function
 * @param  {Function | String} predicate  Comparison function or string
 * @param  {String} destKey               The destination key
 * @return {Array}
 */
export const extendRows = (selector1, selector2, destKey, predicate) => {
  let predicateFunction = predicate;

  if (_.isString(predicate)) {
    const key = predicate;
    predicateFunction = (row1, row2) => {
      return Number(row1[key]) === Number(row2[key]);
    };
  }

  return createSelector(
    selector1(),
    selector2(),
    (rows1, rows2) => {
      return rows1.map(row1 => {
        const clonedRow1 = Object.assign({}, row1);
        clonedRow1[destKey] = rows2.filter(row2 => {
          return predicateFunction(row1, row2);
        }).pop();
        return clonedRow1;
      });
    },
  );
};
