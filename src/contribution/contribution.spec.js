/* eslint-env mocha */

const db = require('../database')
const User = require('../user')
const Repository = require('../repository')
const Contribution = require('./contribution')
const { expect } = require('chai')
const { random } = require('lodash')

describe('contribution model', () => {
  let user
  let repository

  beforeEach('generate random data', async () => {
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
    await Repository.insert(repository)
  })

  afterEach('remove inserted data', async () => {
    await db(Contribution.tableName)
      .where({ user: user.id, repository: repository.id })
      .delete()
    await db(Repository.tableName)
      .where({ id: repository.id })
      .delete()
    await db(User.tableName)
      .where({ id: user.id })
      .delete()
  })

  describe('.insert', () => {
    it('should insert a new contribution', async () => {
      const contribution = {
        user: user.id,
        repository: repository.id,
        line_count: 0
      }
      const contributionInserted = await Contribution.insert(contribution)
      expect(contribution).to.be.eql(contributionInserted)
    })
  })

  describe('.insertOrReplace', () => {
    it('should insert a contribution', async () => {
      const contribution = {
        user: user.id,
        repository: repository.id,
        line_count: 0
      }
      const contributionInserted = await Contribution.insertOrReplace(contribution)
      expect(contribution).to.be.eql(contributionInserted)
    })

    it('should update a contribution', async () => {
      const update = {
        user: user.id,
        repository: repository.id,
        line_count: 1
      }
      const contributionReplaced = await Contribution.insertOrReplace(update)
      expect(update).to.be.eql(contributionReplaced)
    })
  })

  describe('.read', async () => {
    let contributions

    beforeEach('insert contribution data', async () => {
      contributions = [{
        ...await Contribution.insert({
          user: user.id,
          repository: repository.id,
          line_count: 0
        }),
        user,
        repository
      }]
    })

    it('should get contributions by user', async () => {
      const contributionsByUser = await Contribution.read({
        user: {
          id: user.id
        }
      })
      expect(contributionsByUser).to.be.an('array')
      expect(contributionsByUser).to.be.eql(contributions)
    })

    it('should get contributions to repository', async () => {
      const contributionsToRepo = await Contribution.read({
        repository: {
          id: repository.id
        }
      })
      expect(contributionsToRepo).to.be.an('array')
      expect(contributionsToRepo).to.be.eql(contributions)
    })

    it('should get contributions by user to repository', async () => {
      const contributionsByUserToRepo = await Contribution.read({
        repository: {
          id: repository.id
        },
        user: {
          id: user.id
        }
      })
      expect(contributionsByUserToRepo).to.be.an('array')
      expect(contributionsByUserToRepo).to.be.eql(contributions)
    })

    it('should fail with no query', async () => {
      try {
        await Contribution.read()
      } catch (error) {
        expect(error).to.be.an('error')
      }
    })
  })
})
