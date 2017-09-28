const fp = require('lodash/fp')
const db = require('../database')
const joi = require('joi')
const utils = require('../database/utils')
const Repository = require('../repository')
const User = require('../user')

const tableName = 'contributions'

/**
 * Write operations
 */

const insertSchema = joi.object({
  user: joi.number().required(),
  repository: joi.number().required(),
  line_count: joi.number().required()
}).required()

function insert (params) {
  const contribution = joi.attempt(params, insertSchema)
  return db(tableName)
    .insert(contribution)
    .returning('*')
    .then(fp.first)
}

function insertOrReplace (params) {
  const contribution = joi.attempt(params, insertSchema)
  return db.raw(`
    INSERT INTO ?? (??, ??, ??)
    VALUES (?, ?, ?)
    ON CONFLICT (??, ??) DO UPDATE SET ?? = EXCLUDED.??
    RETURNING *
    `, [
      tableName,
      'user',
      'repository',
      'line_count',
      contribution.user,
      contribution.repository,
      contribution.line_count,
      'user',
      'repository',
      'line_count',
      'line_count'
    ])
    .then(fp.prop('rows'))
    .then(fp.first)
}

/**
 * Read operations
 */

const readSchema = joi.object({
  user: joi.object({
    id: joi.number(),
    login: joi.string()
  }).xor('id', 'login'),
  repository: joi.object({
    id: joi.number(),
    full_name: joi.string()
  }).xor('id', 'full_name')
})
  .or('user', 'repository')
  .required()

async function read (params) {
  // Condition
  const { repository = {}, user = {} } = joi.attempt(params, readSchema)
  const condition = fp.omitBy(fp.isUndefined, {
    [`${User.tableName}.id`]: user.id,
    [`${User.tableName}.login`]: user.login,
    [`${Repository.tableName}.id`]: repository.id,
    [`${Repository.tableName}.full_name`]: repository.full_name
  })

  // Selection
  const [userColumns, repoColumns] = await Promise.all([
    utils.getColumnsFromTable(User.tableName)
      .then(columns =>
        utils.addTablePreffixToSelection(User.tableName, columns)
      ),
    utils.getColumnsFromTable(Repository.tableName)
      .then(columns =>
        utils.addTablePreffixToSelection(Repository.tableName, columns)
      )
  ])
  const contribColumns = utils.addTablePreffixToSelection(
    tableName,
    ['line_count']
  )
  const selection = [...contribColumns, ...repoColumns, ...userColumns]

  return db(tableName)
    .where(condition)
    .leftJoin(
      User.tableName,
      `${tableName}.user`,
      `${User.tableName}.id`
    )
    .leftJoin(
      Repository.tableName,
      `${tableName}.repository`,
      `${Repository.tableName}.id`
    )
    .select(selection)
    .map(row => ({
      ...utils.extractPreffixedColumns(tableName, row),
      repository: utils.extractPreffixedColumns(Repository.tableName, row),
      user: utils.extractPreffixedColumns(User.tableName, row)
    }))
}

module.exports = {
  tableName,
  insert,
  insertOrReplace,
  read
}
