const knex = require("../utils/connection");
const exec = require("child_process").exec;
var rimraf = require("rimraf");

const sqlineMigrate = (dbmsSource, dbmsTarget, dbName) => {
  return new Promise(async (resolve, reject) => {
    // console.log(
    //   `cd databases && ./sqlines -s=${dbmsSource} -t=${dbmsTarget} -in=./${dbName}/${dbmsSource}-${dbName}.sql -out=./${dbName}/${dbmsTarget}-${dbName}.sql -rems`
    // );
    await exec(
      `cd databases && ./sqlines -s=${dbmsSource} -t=${dbmsTarget} -in=./${dbName}/${dbmsSource}-${dbName}.sql -out=./${dbName}/${dbmsTarget}-${dbName}.sql -rems`,
      async (err, stdout, stderror) => {
        // console.log(stdout);
        await resolve(`Success of Migrate, ${dbmsSource} to ${dbmsTarget}`);
      }
    );
  });
};

const migrateAllSQLFiles = (dbmsSource, dbName) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (dbmsSource === "mysql") {
        await sqlineMigrate(dbmsSource, "postgres", dbName);
        await sqlineMigrate(dbmsSource, "sql", dbName);
      } else if (dbmsSource === "postgres") {
        await sqlineMigrate(dbmsSource, "mysql", dbName);
        await sqlineMigrate(dbmsSource, "sql", dbName);
      } else if (dbmsSource === "sql") {
        await sqlineMigrate(dbmsSource, "mysql", dbName);
        await sqlineMigrate(dbmsSource, "postgres", dbName);
      }
      await resolve("Success All File Migrate");
    } catch (error) {
      // console.log("reject");
      await reject("Failed All File Migrate");
    }
  });
};

const mysqlImport = dbName => {
  return new Promise(async (resolve, reject) => {
    await exec(
      `mysql --user=root --password=cmugrader ${dbName} < databases/${dbName}/mysql-${dbName}.sql`,
      async (err, stdout, stderror) => {
        if (err) {
          await reject({ error: err, stderror: stderror });
        }
        await resolve(`Success of Import, ${dbName} in MySQL and MariaDB`);
      }
    );
  });
};

const pgImport = dbName => {
  return new Promise(async (resolve, reject) => {
    await exec(
      `pgloader  mysql://root:cmusqlgrader@localhost/${dbName} postgresql://postgres:cmusqlgrader@localhost/${dbName}`
    );
    await resolve(`Success of Import, ${dbName} in Postgres`);
  });
};

const mssqlImport = dbName => {
  return new Promise(async (resolve, reject) => {
    await exec(
      `sqlcmd -S localhost -U SA -P CMUsqlgrader1 -i databases/${dbName}/sql-${dbName}.sql`,
      async (err, stdout, stderror) => {
        console.log(stdout, err, stderror);
        if (err) {
          await reject({ error: err, stderror: stderror });
        }
        await resolve(`Success of Import, ${dbName} in Microsoft SQL Server`);
      }
    );
  });
};

const delFolderDatabases = dbName => {
  return new Promise(async (resolve, reject) => {
    await rimraf(`/databases/${dbName}`);
    await resolve(`Success of Import, ${dbName} in Microsoft SQL Server`);
  });
};

const importAllDb = dbName => {
  return new Promise(async (resolve, reject) => {
    try {
      await mysqlImport(dbName);
      await mssqlImport(dbName);
      await pgImport(dbName);
      resolve("Successful to Import");
    } catch (error) {
      reject({ message: "error to import", error: error });
    }
  });
};

module.exports = {
  sqlineMigrate,
  migrateAllSQLFiles,
  mysqlImport,
  pgImport,
  mssqlImport,
  delFolderDatabases,
  importAllDb
};
