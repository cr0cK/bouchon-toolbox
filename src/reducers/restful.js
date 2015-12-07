import _ from 'lodash';


/**
 * Default predicate used to valid / filters some entities.
 *
 * @param  {Object} entity   An entity
 * @param  {Object} params   Params or body of the query
 * @return {Boolean}
 */
const defaultPredicate = (entity, params, idKey = 'id') => {
  return Number(entity[idKey]) === Number(params[idKey]);
};

/**
 * Retrieve entities. Typically, handle GET verbs.
 *
 * From: https://spring.io/understanding/REST
 * "Retrieve information. GET requests must be safe and idempotent, meaning
 * regardless of how many times it repeats with the same parameters, the results
 * are the same. They can have side effects, but the user doesn't expect them,
 * so they cannot be critical to the operation of the system. Requests can
 * also be partial or conditional."
 *
 * @param  {Mixed} state          Current state
 * @return {Mixed}                New state
 */
export const retrieve = (state, idKey = 'id') => _.sortBy(state, idKey);

/**
 * Create an entity. Typically, handle POST verbs.
 *
 * From: https://spring.io/understanding/REST
 * "Request that the resource at the URI do something with the provided entity.
 * Often POST is used to create a new entity, but it can also be used to update
 * an entity."
 *
 * @param  {Array} state          Current state
 * @param  {Object} body          Body of the request
 * @param  {Object} SchemaObject  Schema of the new entity
 * @param  {String} idKey         Name of the id key
 * @return {Array}                New state
 */
export const create = (state, body, SchemaObject, idKey = 'id') => {
  if (body[idKey]) {
    throw new Error('body should not provide an id when creating an entity.');
  }

  const idValue = _.max(state.map(entity => entity[idKey])) + 1;

  const entity = new SchemaObject({
    ...body,
    [idKey]: idValue,
  });

  return _.sortBy([
    ...state,
    entity.toObject(),
  ], idKey);
};

/**
 * Update or create an entity. Typically, handle PUT verbs.
 *
 * From: https://spring.io/understanding/REST
 * "Store an entity at a URI. PUT can create a new entity or update an existing
 * one. A PUT request is idempotent. Idempotency is the main difference between
 * the expectations of PUT versus a POST request."
 *
 * Note: PUT replaces an existing entity. If only a subset of data elements
 * are provided, the rest will be replaced with empty or null.
 *
 * @param  {Object} state        Current state
 * @param  {Object} params       Params of the query
 * @param  {Object} body         Body of the query
 * @param  {Object} SchemaObject Schema of the new entity
 * @param  {Function} predicate  Predicate function
 * @param  {String} idKey        Name of the id key
 * @return {Object}              New state
 */
export const updateOrCreate = (
  state, params, body, SchemaObject,
  idKey = 'id', predicate = defaultPredicate
) => {
  if (!params[idKey]) {
    throw new Error('Params should provide an id when updating an entity.');
  }

  const existingEntity = state
    .filter(entity => predicate(entity, params, idKey))
    .pop();

  // create a new entity with a defined idKey
  if (!existingEntity) {
    const entity = new SchemaObject({
      ...body,
      [idKey]: params[idKey],
    });

    return [
      ...state,
      entity.toObject(),
    ];
  }

  // update entity
  const updatedEntity = {
    ...existingEntity,
    ...body,
  };

  // set to null the properties that are not provided in body
  _.difference(Object.keys(existingEntity), Object.keys(body)).map(key => {
    if (key === idKey) {  // dont set to null the idKey
      return;
    }
    updatedEntity[key] = null;
  });

  const sanitizedEntity = new SchemaObject(updatedEntity, {setUndefined: true});

  const newState = state.slice(0);
  _.remove(newState, entity => predicate(entity, params, idKey));

  return _.sortBy([
    ...newState,
    sanitizedEntity.toObject(),
  ], idKey);
};

/**
 * Update an entity. Typically, handle PATCH verbs.
 *
 * From: https://spring.io/understanding/REST
 * Update only the specified fields of an entity at a URI. A PATCH request is
 * idempotent. Idempotency is the main difference between the expectations of
 * PATCH versus a POST request.
 */
export const update = (
  state, params, body, SchemaObject,
  idKey = 'id', predicate = defaultPredicate
) => {
  if (!params[idKey]) {
    throw new Error('Params should provide an id when updating an entity.');
  }

  const existingEntity = state
    .filter(entity => predicate(entity, params, idKey))
    .pop();

  if (!existingEntity) {
    return state;
  }

  // update entity
  const updatedEntity = {
    ...existingEntity,
    ...body,
  };

  const sanitizedEntity = new SchemaObject(updatedEntity);

  const newState = state.slice(0);
  _.remove(newState, entity => predicate(entity, params, idKey));

  return _.sortBy([
    ...newState,
    sanitizedEntity.toObject(),
  ], idKey);
};

/**
 * Delete an entity. Typically, handle DELETE verbs.
 *
 * From: https://spring.io/understanding/REST
 * Request that a resource be removed; however, the resource does not have to
 * be removed immediately. It could be an asynchronous or long-running request.
 *
 * @param  {Array} state          Current state
 * @param  {Object} params        Params of the request
 * @param  {Function} predicate   Predicate function
 * @return {Array}                New state
 */
export const delete_ = (
  state, params,
  idKey = 'id', predicate = defaultPredicate
) => {
  const stateCopy = state.slice(0);
  _.remove(stateCopy, entity => predicate(entity, params, idKey));
  return stateCopy;
};

/**
 * Return an object compatible to redux-act.createReducer that defines the
 * whole state management for a Restful API.
 *
 * Note:
 * Like any reducers, it handles only the state,
 * not the output that concerns selectors.
 *
 * @param  {Object} actions           Actions
 * @param  {Object} SchemaObject      Schema of the new entity
 * @param  {Function} predicate       Predicate function
 * @return {Object}                   Reducer definition
 */
export const restful = (
  actions, SchemaObject,
  predicate = defaultPredicate, idKey = 'id'
) => {
  return {
    [actions.get]: state => retrieve(state, idKey),
    [actions.post]: (state, {body}) => (
      create(state, body, SchemaObject, idKey)
    ),
    [actions.put]: (state, {params, body}) => (
      updateOrCreate(state, params, body, SchemaObject, idKey, predicate)
    ),
    [actions.patch]: (state, {params, body}) => (
      update(state, params, body, SchemaObject, idKey, predicate)
    ),
    [actions.delete]: (state, {params}) => (
      delete_(state, params, idKey, predicate)
    ),
  };
};
