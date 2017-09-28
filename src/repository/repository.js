const fp = require('lodash/fp')
const utils = require('../database/utils')
const db = require('../database')
const joi = require('joi')
const User = require('../user')

const tableName = 'repositories'

/**
 * Write operations
 */

const insertSchema = joi.object({
  id: joi.number().integer().required(),
  owner: joi.number().required(),
  full_name: joi.string().required(),
  description: joi.string(),
  html_url: joi.string().required(),
  language: joi.string(),
  stargazers_count: joi.number().integer().required()
}).required()

function insert (params) {
  const repository = joi.attempt(params, insertSchema)
  return db(tableName)
    .insert(repository)
    .returning('*')
    .then(fp.first)
}

/**
 * Read operations
 */
const readSchema = joi.object({
  id: joi.number().integer(),
  full_name: joi.string()
})
  .xor('id', 'full_name')
  .required()

async function read (params) {
  const userColumns = await utils.getColumnsFromTable(User.tableName)
    .then(columns => utils.addTablePreffixToSelection(User.tableName, columns))
  const repoColumns = await utils.getColumnsFromTable(tableName)
    .then(columns => utils.addTablePreffixToSelection(tableName, columns))

  const selection = [...repoColumns, ...userColumns]
  const query = joi.attempt(params, readSchema)
  const condition = fp.omitBy(fp.isUndefined, {
    [`${tableName}.id`]: query.id,
    [`${tableName}.full_name`]: query.full_name
  })
  const data = await db(tableName)
    .where(condition)
    .leftJoin(User.tableName, `${tableName}.owner`, `${User.tableName}.id`)
    .select(selection)
    .first()

  const owner = utils.extractPreffixedColumns(User.tableName, data)
  const repo = utils.extractPreffixedColumns(tableName, data)
  return { ...repo, owner }
}

module.exports = {
  tableName,
  insert,
  read
}
