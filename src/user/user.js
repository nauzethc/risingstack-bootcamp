const { head } = require('lodash')
const db = require('../database')
const joi = require('joi')

const tableName = 'users'

/**
 * Write operations
 */

const insertSchema = joi.object({
  id: joi.number().integer().required(),
  login: joi.string().required(),
  avatar_url: joi.string().required(),
  html_url: joi.string().required(),
  type: joi.string().required()
}).required()

function insert (params) {
  const user = joi.attempt(params, insertSchema)
  return db(tableName)
    .insert(user)
    .returning('*')
    .then(result => head(result))
}

/**
 * Read operations
 */
const readSchema = joi.object({
  id: joi.number().integer(),
  login: joi.string()
})
  .xor('id', 'login')
  .required()

function read (params) {
  const condition = joi.attempt(params, readSchema)
  return db(tableName)
    .where(condition)
    .select()
    .first()
}

module.exports = {
  tableName,
  insert,
  read
}
