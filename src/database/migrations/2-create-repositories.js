const tableName = 'repositories'

function up (knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.integer('id').notNullable().unique()
    table.integer('owner').unsigned().notNullable()
    table.foreign('owner').references('users.id')
    table.string('full_name').notNullable()
    table.string('description')
    table.string('html_url').notNullable()
    table.string('language')
    table.integer('stargazers_count')
  })
}

function down (knex) {
  return knex.schema.dropTableIfExists(tableName)
}

module.exports = {
  up,
  down
}
