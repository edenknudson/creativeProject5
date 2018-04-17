exports.up = function(knex, Promise) {
  return Promise.all([
    knex.raw("alter table pictureposts add comment text"),
  ]);
};
exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw("alter table pictureposts add comment text"),
  ]);
};
