/* eslint-env mocha */
process.env.NODE_ENV = 'test'

const { expect } = require('chai')
const nock = require('nock')
const api = require('./api')

describe('Github API', () => {
  /**
   * Test Github API
   */
  it('should search repostories', async () => {
    const mockup = nock('https://api.github.com', {
      reqheaders: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'risingstack/bootcamp'
      }
    })
      .get('/search/repositories')
      .query({ q: 'language:javascript' })
      .reply(200, { items: [] })

    const result = await api.searchRepositories({ q: 'language:javascript' })
    expect(mockup.isDone()).to.eql(true)
    expect(result).to.eql({ items: [] })
  })

  it('should get contributors', async () => {
    const mockup = nock('https://api.github.com', {
      reqheaders: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'risingstack/bootcamp'
      }
    })
      .get('/repos/owner/repository/stats/contributors')
      .reply(200, [{ author: {}, weeks: [] }])

    const result = await api.getContributors('owner/repository')
    expect(mockup.isDone()).to.eql(true)
    expect(result).to.eql([{ author: {}, weeks: [] }])
  })
})
