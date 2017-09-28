const database = require('../src/database')
const winston = require('winston')

database.migrate.latest().then(() => {
  winston.info('Database migrations completed!')
  process.exit()
})
