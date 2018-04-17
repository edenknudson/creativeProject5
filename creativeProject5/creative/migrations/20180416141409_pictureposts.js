exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('pictureposts', function(table) {
      table.increments('id').primary();
      table.string('pictureposts');
      table.dateTime('created');
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('pictureposts'),
  ]);
};
