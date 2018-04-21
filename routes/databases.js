var express = require("express");
var router = express.Router();
var axios = require("axios");
var multer = require("multer");
var exec = require("child_process").exec;
const fs = require("fs");
var prepend = require("prepend");
const response = require("../model/response");
const model = require("../model/database");
const helper = require("../controllers/helper");
const controller = require("../controllers/database");

var knexmssql = require("knex")({
  client: "mssql",
  connection: {
    host: "127.0.0.1",
    user: "SA",
    password: "CMUsqlgrader1"
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "databases/");
  },
  filename: (req, file, cb) => {
    cb(null, "importfile.sql");
  }
});

var upload = multer({ storage: storage });

router.post("/createdb", upload.single("databasefile"), async (req, res) => {
  const dataFile = await helper.searchAndEditDBFile();
  const dbName = await dataFile.dbName.toLowerCase();
  // console.log(dbName);
  try {
    // await helper.addUseDatabaseInFileSQL(dbName, dbms);
    const dbms = await req.body.dbms;
    const pathDb = "databases/" + dbName + "/";
    const fileName = "original-" + dbName + ".sql";
    const fileNameWithDBMS = dbms + "-" + dbName + ".sql";
    await helper.mkdirDatabases(pathDb);
    await fs
      .createReadStream("databases/importfile.sql")
      .pipe(fs.createWriteStream(pathDb + fileName));
    await fs
      .createReadStream("databases/output.sql")
      .pipe(fs.createWriteStream(pathDb + fileNameWithDBMS));
    await fs.unlinkSync("databases/importfile.sql");
    await fs.unlinkSync("databases/output.sql");
    await controller.migrateAllSQLFiles(dbms, dbName);
    await model.addDbNameintoServer(dbName);
    await model.createDatabaseAllDbms(dbName);
    await controller.importAllDb(dbName);
    res.status(200).send(response.successResult("CREATE DATABASE SUCCESSFUL"));
  } catch (error) {
    console.log(error);
    //await controller.delFolderDatabases(dbName);
    await model.delDatabaseName(dbName);
    await model.dropAllDatabase(dbName);
    res.status(500).send(response.errorResult(error));
  }
});

router.post("/updatedb", upload.single("databasefile"), async (req, res) => {
  // fs.createReadStream('databases/importfile.sql').pipe(fs.createWriteStream('databases/test.sql'));
  const dbms = req.body.dbms;
  const dbName = req.body.dbName;
  res.send(req.body);
});

router.post("/deletedb", async (req, res) => {
  await model.delDatabaseName(dbName);
  await model.dropAllDatabase(dbName);
  res.status(200).send(response.successResult("DROP ALL DATABASE SUCCESSFUL"));
});

router.post("/test", async (req, res) => {
  await prepend(
    "./databases/companyelmasri/mysql-companyelmasri.sql",
    "use[data]",
    function(error) {
      if (error) console.error(error.message);
    }
  );
  await res
    .status(200)
    .send(response.successResult("DROP ALL DATABASE SUCCESSFUL"));
});

router.get("/getdatabaseassignment", async (req, res) => {
  const data = await model.getDatabaseAssignment();
  res.send(data);
});

router.get("/gettablelist/:databaseName", async (req, res) => {
  const data = await model.getTableList(req.params.databaseName);
  res.send(data.rows);
});

router.get("/getdatatable/:databaseName/:tableName", async (req, res) => {
  const data = await model.getDataTable(
    req.params.databaseName,
    req.params.tableName
  );
  res.send(data);
});

module.exports = router;
