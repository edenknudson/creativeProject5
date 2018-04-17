exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('items', function(table) {
      table.increments('id').primary();
      table.string('label');
      table.string('image');
      table.string('url');
      table.string('calories');
      table.string('servings');
      table.string('cps');
      table.string('ingredients');
      table.string('cautions');
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('items'),
  ]);
};
