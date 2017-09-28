const path = require('path')

module.exports = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'risingstack',
    password: 'risingstack',
    database: 'bootcamp'
  },
  migrations: {
    tableName: 'migrations',
    directory: path.join(__dirname, 'migrations')
  }
})
