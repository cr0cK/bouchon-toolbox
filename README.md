# bouchon-toolbox

A set of tools for [bouchon](https://github.com/cr0cK/bouchon).

## What is a selector?

A selector is a function that returns a subset of an existing collection.

They are composable and performant (by using memoization).

bouchon is providing `createSelector` from [reselect](https://github.com/rackt/reselect).

## filterRows

`filterRows` is useful to filter an array easily.

Imagine that you want to retrieve the books of an author:

```js
import { createSelector } from 'bouchon';

const selectors = {};

selectors.all = () => state => state.books;

selectors.byId = ({author}) => state => createSelector(
  selectors.all(),
  books => books.filter(book => book.author === author)
);
```

It could be written easier:

```js
import { selectors } from bouchon-toolbox';
const { filterRows } = selectors;

const selectors = {};

selectors.all = () => state => state.books;
selectors.byAuthor = ({author}) => filterRows(selectors.all(), 'author', author);
```

`filterRows` returns a selector that can be use inside an another selector.

For example, if you want to return the books of an author for a specific years
(it can be the response of an url like `/books/:author/:date`), you can do like this:

```js
import { selectors } from bouchon-toolbox';
const { filterRows } = selectors;

const selectors = {};

selectors.all = () => state => state.books;
selectors.byAuthor = ({author}) => filterRows(selectors.all(), 'author', author);
selectors.byDate = ({author, date}) => filterRows(selectors.byAuthor({author}), 'date', date);
```

## extendRows

`extendRows` is useful to extend a collection with data of an another collection.

For example, imagine that your want the author data with your books collection:

```js
export const selectors = {};

selectors.books = () => state => state.books;
selectors.authors = () => state => state.authors;

selectors.all = () => extendRows(
  selectors.books(),
  'author_id',
  selectors.authors(),
  'id',
  'author',
);
```

It will return books with their author by comparing `books.author_id` with `authors.id` (similar to a SQL join query).


## Installation

``` bash
npm install bouchon-toolbox
```
