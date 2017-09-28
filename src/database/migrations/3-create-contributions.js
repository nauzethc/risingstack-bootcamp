const tableName = 'contributions'

function up (knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.integer('user').unsigned().notNullable()
    table.foreign('user').references('users.id')
    table.integer('repository').unsigned().notNullable()
    table.foreign('repository').references('repositories.id')
    table.integer('line_count').unsigned()
    table.unique(['user', 'repository'])
  })
}

function down (knex) {
  return knex.schema.dropTableIfExists(tableName)
}

module.exports = {
  up,
  down
}
