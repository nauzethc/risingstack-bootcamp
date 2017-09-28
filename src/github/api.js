const request = require('request-promise')
const ENDPOINT = 'https://api.github.com'

const defaults = {
  method: 'GET',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'risingstack/bootcamp'
  },
  json: true
}

function searchRepositories (query = {}) {
  return request({
    ...defaults,
    uri: `${ENDPOINT}/search/repositories`,
    qs: query
  })
}

function getContributors (repo, query = {}) {
  return request({
    ...defaults,
    uri: `${ENDPOINT}/repos/${repo}/stats/contributors`,
    qs: query
  })
}

module.exports = {
  searchRepositories,
  getContributors
}
