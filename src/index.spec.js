/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

const chai = require('chai')
const chaiHttp = require('chai-http')
const Index = require('../src/index')

chai.use(chaiHttp)

describe('Service', () => {
  /**
   * Test the /hello route
   */
  describe('/GET hello', () => {
    it('should return "Hello Node.js!', (done) => {
      chai.request(Index)
        .get('/hello')
        .end((err, res) => {
          chai.expect(err).to.be.null
          chai.expect(res).to.have.status(200)
          chai.expect(res).to.be.text
          chai.expect(res.text).to.be.equal('Hello Node.js!')
          done()
        })
    })
  })
})
