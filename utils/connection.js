// var pg = require('knex')({
//     client: 'pg',
//     connection: 'postgres://postgres:cmusqlgrader@localhost'
// });

var moment = require("moment");

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
      // typeCast: function(field, next) {
      //   if (field.type == "DATE") {
      //     return moment(
      //       moment(field.string()).format("YYYY-MM-DD")
      //     ).toISOString();
      //   }
      //   return next();
      // }
    },
    pool: { min: 0, max: 100 }
  });
};

const mssqlCustom = databaseName => {
  return require("knex")({
    client: "mssql",
    connection: {
      host: "127.0.0.1",
      user: "SA",
      password: "CMUsqlgrader1",
      database: databaseName,
      multipleStatements: true,
      timezone: "Asia/Bangkok"
    },
    pool: { min: 0, max: 100 }
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
      database: databaseName,
      multipleStatements: true
    },
    pool: { min: 0, max: 100 }
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
  mysqlCustom,
  mssqlCustom
};
