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

const mysqlCustom = databaseName => {
  return require("knex")({
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "cmugrader",
      database: databaseName,
      multipleStatements: true
    }
  });
};

const pgAdmin = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "cmusqlgrader",
    database: "postgres"
  }
});

const pgCustom = databaseName => {
  return require("knex")({
    client: "pg",
    connection: {
      host: "127.0.0.1",
      user: "postgres",
      password: "cmusqlgrader",
      database: databaseName
      // multipleStatements: true
    }
  });
};

const pgGrader = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "cmusqlgrader",
    database: "grader",
    searchPath: ["knex", "public"]
  }
});

module.exports = {
  mysqlAdmin,
  pgAdmin,
  pgGrader,
  mssqlAdmin,
  pgCustom,
  mysqlCustom
};
