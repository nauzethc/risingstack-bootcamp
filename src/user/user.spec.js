/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

const db = require('../database')
const User = require('./user')
const { expect } = require('chai')
const { head } = require('lodash')

describe('User model', () => {
  let id
  let user

  /**
   * Generate random user for testing
   */
  beforeEach('generate random user', () => {
    id = Math.floor(Math.random() * 1000)
    user = {
      id,
      login: 'username',
      avatar_url: 'http://avatar.png',
      html_url: 'http://repo.com',
      type: 'repotype'
    }
  })

  /**
   * Remove generated user after test
   */
  afterEach('remove generated user', async () => {
    await db(User.tableName).where({ id }).delete()
  })

  describe('.insert', () => {
    it('should insert a new user', async () => {
      const userInserted = await User.insert(user)
      const userRead = head(await db(User.tableName).where({ id }))
      expect(userInserted).to.be.eql(user)
      expect(userRead).to.be.eql(user)
    })

    it('should validate params', async () => {
      delete user.login
      try {
        await User.insert(user)
      } catch (err) {
        expect(err.name).to.be.eql('ValidationError')
      }
    })
  })
})
