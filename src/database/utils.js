const db = require('./index')
const fp = require('lodash/fp')

function getColumnsFromTable (tableName) {
  return db('information_schema.columns')
    .where({ table_name: tableName })
    .select('column_name')
    .then(fp.map(fp.prop('column_name')))
}

function addTablePreffixToSelection (tableName, columns) {
  return columns.map(column => `${tableName}.${column} as ${tableName}_${column}`)
}

function extractPreffixedColumns (tableName, data) {
  return fp.compose(
    fp.fromPairs,
    fp.map(([column, value]) => [fp.replace(`${tableName}_`, '', column), value]),
    fp.toPairs,
    fp.pickBy((value, column) => fp.startsWith(`${tableName}_`, column))
  )(data)
}

module.exports = {
  addTablePreffixToSelection,
  extractPreffixedColumns,
  getColumnsFromTable
}
