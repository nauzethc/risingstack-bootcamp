/* eslint-env mocha */

const db = require('../database')
const Repository = require('./repository')
const User = require('../user')
const { expect } = require('chai')
const { random } = require('lodash')

describe('repository model', () => {
  let id
  let repository
  let user

  /**
   * Insert generated user, generate random repo
   */
  beforeEach('generate random repository, insert random user', async () => {
    user = {
      id: random(1000),
      login: 'testinglogin',
      avatar_url: 'http://url.to/avatar.jpg',
      html_url: 'http://url.to/user',
      type: 'usertype'
    }
    await User.insert(user)
    repository = {
      id: random(1000),
      owner: user.id,
      full_name: 'testing/repository',
      description: 'Testing description',
      html_url: 'http://url.to/repo',
      language: 'javascript',
      stargazers_count: 0
    }
    id = repository.id
  })

  /**
   * Remove inserted repository and user after test
   */
  afterEach('remove generated data', async () => {
    await db(Repository.tableName).where({ id }).delete()
    await db(User.tableName).where({ id: user.id }).delete()
  })

  describe('.insert', () => {
    it('should insert a new repository', async () => {
      const repositoryInserted = await Repository.insert(repository)
      expect(repositoryInserted).to.be.eql(repository)
    })
  })

  describe('.read', () => {
    it('should populate user data with join', async () => {
      const repositoryExpected = { ...repository, owner: { ...user } }
      await Repository.insert(repository)
      const repositoryRead = await Repository.read({ id })
      expect(repositoryRead).to.be.eql(repositoryExpected)
    })
  })
})
