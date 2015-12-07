/**
 * Routes middlewares
 * Use it like this:
 *
 * 'GET /posts': {
 *    middlewares: [setPaginationHeaders],
 *  },
 */

/**
 * Add headers for the pagination.
 * Handle query params like: ?page=2&perpage=10
 *
 * @param  {Object} data Selected data
 */
export const setPaginationHeaders = data => (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 10;
  const pageCount = Math.ceil(data.length / perPage);
  const totalCount = data.length;
  const slicedData = data.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const headers = {
    'x-page': page,
    'x-per-page': perPage,
    'x-page-count': pageCount,
    'x-total-count': totalCount,
  };

  res.data = slicedData;
  res.set(headers);

  next();
};
