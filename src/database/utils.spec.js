/* eslint-env mocha */

const { expect } = require('chai')
const { tableName } = require('../user')
const utils = require('./utils')

describe('Database utils', () => {
  const columnsExpected = [
    'id',
    'login',
    'avatar_url',
    'html_url',
    'type'
  ]

  describe('getColumnsFromTable', () => {
    it('should return users table columns', async () => {
      const columnsReturned = await utils.getColumnsFromTable(tableName)
      expect(columnsReturned).to.be.eql(columnsExpected)
    })
  })

  describe('addTablePreffixToSelection', () => {
    it('should return preffixed selection', (done) => {
      const columns = [
        'id',
        'name'
      ]
      const expected = [
        'preffix.id as preffix_id',
        'preffix.name as preffix_name'
      ]
      expect(utils.addTablePreffixToSelection('preffix', columns)).to.be.eql(expected)
      done()
    })
  })

  describe('extractPreffixedColumns', () => {
    it('should extract columns and remove preffix', (done) => {
      const input = {
        'preffix_id': 1,
        'preffix_name': 'name',
        'other': 'no-preffix-data'
      }
      const expected = {
        'id': 1,
        'name': 'name'
      }
      expect(utils.extractPreffixedColumns('preffix', input)).to.be.eql(expected)
      done()
    })
  })
})
