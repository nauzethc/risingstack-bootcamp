const tableName = 'users'

function up (knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.integer('id').notNullable().unique()
    table.string('login').notNullable().unique()
    table.string('avatar_url')
    table.string('html_url').notNullable()
    table.string('type')
  })
}

function down (knex) {
  return knex.schema.dropTableIfExists(tableName)
}

module.exports = {
  up,
  down
}
