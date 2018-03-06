// var pg = require('knex')({
//     client: 'pg',
//     connection: 'postgres://postgres:cmusqlgrader@localhost'
// });

const mssqlAdmin = require("knex")({
  client: "mssql",
  connection: {
    host: "127.0.0.1",
    user: "SA",
    password: "CMUsqlgrader1"
  }
});

const mysqlAdmin = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "cmugrader"
  }
});

const pgAdmin = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "cmugrader",
    database: "postgres"
  }
});

const pgCustom = databaseName => {
  return require("knex")({
    client: "pg",
    connection: {
      host: "127.0.0.1",
      user: "postgres",
      password: "cmugrader",
      database: databaseName
    }
  });
};

const pgGrader = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "cmugrader",
    database: "grader",
    searchPath: ["knex", "public"]
  }
});

module.exports = {
  mysqlAdmin,
  pgAdmin,
  pgGrader,
  mssqlAdmin,
  pgCustom
};
