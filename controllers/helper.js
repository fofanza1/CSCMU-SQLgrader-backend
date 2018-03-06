const fs = require("fs");
const multer = require("multer");
var prepend = require("prepend");
var readline = require("readline");

const mkdirDatabases = path => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

const addUseDatabaseInFileSQL = (dbName, dbms) => {
  new Promise(async (resolve, reject) => {
    var useDb = await stringUseFile(dbName, dbms);
    await prepend("databases/importfile.sql", useDb, error => {
      if (error) {
        reject(error);
      }
      resolve("Add Top File");
    });
  });
};

const stringUseFile = (dbName, dbms) => {
  if (dbms === "sql") {
    var useDb = `USE [${dbName}];`;
  } else {
    var useDb = "USE `" + dbName + "`;";
  }
  return useDb;
};

const searchAndEditDBFile = () => {
  return new Promise(async (resolve, reject) => {
    var dbName = "";
    var myInterface = await readline.createInterface({
      input: fs.createReadStream("databases/importfile.sql"),
      output: fs.createWriteStream("databases/output.sql")
    });
    await myInterface.on("line", async line => {
      var lineSplit = await line.split(" ");
      if ((await lineSplit[0].toLowerCase()) === "use") {
        await myInterface.output.write(line + "\n");
        dbName = await lineSplit[1].replace(
          /[&\[\]\/\\#,+()$~%.'";`:*?<>{}]/g,
          ""
        );
      } else if (lineSplit.length > 1) {
        if (lineSplit[1].toLowerCase() !== "database") {
          await myInterface.output.write(line + "\n");
        }
      } else {
        await myInterface.output.write(line + "\n");
      }
    });
    await myInterface.on("close", async () => {
      console.log("----end-----");
      await resolve({ dbName: dbName });
    });
  });
};

const writeAssignmentSubmitFile = (assignmentNumber, noofQuestion) => {
  return new Promise(async (resolve, reject) => {
    var stream = fs.createWriteStream("test.sql");
    stream.write("-- Assignment #" + assignmentNumber + "\n");
    for (i = 1; i <= noofQuestion; i++) {
      stream.write("\n");
      stream.write("-- start#" + i + "\n");
      stream.write("\n");
      stream.write("-- end#" + i + "\n");
    }
    stream.end(() => {
      resolve("yes");
    });
  });
};

module.exports = {
  mkdirDatabases,
  addUseDatabaseInFileSQL,
  searchAndEditDBFile,
  writeAssignmentSubmitFile
};
