exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('foodValue', function(table) {
      table.increments('id').primary();
      table.string('word');
      table.string('choice');
      table.string('first');
      table.string('last');
      table.string('health');
      table.string('diet');
      table.integer('count');
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');

    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('foodValue'),
  ]);
};
