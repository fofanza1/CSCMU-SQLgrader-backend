const knex = require("../utils/connection");
const exec = require("child_process").exec;

const getTableList = dbName => {
  return new Promise((resolve, reject) => {
    knex
      .pgCustom(dbName)
      .raw(
        `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'`
      )
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const checkExist = dbName => {
  return new Promise((resolve, reject) => {
    if(dbName === ''){
      reject("Not Found USE database");
    }
    knex
      .pgGrader("databases")
      .where({
        dbname: dbName
      })
      .select()
      .then(data => {
        if (data.length <= 0) {
          resolve(data);
        } else {
          reject("databases Name is Exist");
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getDataTable = (dbName, tableName) => {
  return new Promise((resolve, reject) => {
    const grader = knex.pgCustom(dbName);
    grader
      .select()
      .table(tableName)
      .then(data => {
        grader.destroy();
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getDatabaseAssignment = async () => {
  return new Promise((resolve, reject) => {
    const dataGrader = knex.pgGrader;
    dataGrader
      .select()
      .table("databases")
      .then(data => {
        // dataGrader.destory();
        resolve(data);
        // reject(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const addDbNameintoServer = dabaseName => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("databases")
      .insert({ dbname: dabaseName })
      .then(data => {
        console.log(data);
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const createDatabaseAllDbms = dbName => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(dbName);
      await knex.mysqlAdmin.raw("CREATE DATABASE " + dbName);
      await knex.pgAdmin.raw("CREATE DATABASE " + dbName);
      await knex.mssqlAdmin.raw("CREATE DATABASE " + dbName);
      resolve("Successful Create Database");
    } catch (error) {
      dropAllDatabase(dbName);
      reject({ message: "Error Create Database", err: error });
    }
  });
};

const dropAllDatabase = async dbName => {
  return new Promise(async (resolve, reject) => {
    // await knex.pgGrader('databases').where('dbid', dbid).del();
    await knex.mysqlAdmin.raw("DROP DATABASE " + dbName);
    await knex.pgAdmin.raw("DROP DATABASE " + dbName);
    await knex.mssqlAdmin.raw("DROP DATABASE " + dbName);
    resolve("DROP ALL DATABASE");
  });
};

const delDatabaseName = async dbName => {
  return new Promise(async (resolve, reject) => {
    await knex
      .pgGrader("databases")
      .where("dbname", dbName)
      .del();
    resolve("Delete DATABASE Name");
  });
};

const getDatabaseNameById = anumber => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("databases")
      .where({
        dbid: dbid
      })
      .select("db")
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {
  getTableList,
  getDataTable,
  getDatabaseAssignment,
  addDbNameintoServer,
  createDatabaseAllDbms,
  dropAllDatabase,
  delDatabaseName,
  getDatabaseNameById,
  checkExist
};
