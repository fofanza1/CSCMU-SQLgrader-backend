var fs = require("mz/fs");
var readline = require("readline");
var officegen = require("officegen");
const assignmentsModel = require("../model/assignment");
var knex = require("../utils/connection");

var _ = require("lodash");

const checkSameAnswer = async (courseId, assignmentNumber, questionNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await fs.readFile(
        `./assignments/${assignmentNumber}/${questionNumber}/answer.json`,
        "utf8"
      );
      const dataParse = await JSON.parse(data);
      resolve(dataParse);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const readlineAnswerSubmit = FilePath => {
  return new Promise(async (resolve, reject) => {
    const data = await fs.readFile(FilePath, "utf8");
    var array = await data
      .toString()
      .split("\n")
      .filter(s => s.trim())
      .map(s => s.trim());
    resolve(array);
  });
};

const splitAnswerAlongNumberOfQuestion = (
  dataArray,
  assignmentNumber,
  noOfQuestion
) => {
  return new Promise(async (resolve, reject) => {
    var questionCount = 1;
    var stringQuestionAnswer = "";
    var checkInsideQuestionAnswer = false;
    // console.log(dataArray);
    var arrayAnswer = [];
    for (let item of dataArray) {
      if (
        item.includes("--") &&
        item.includes("start") &&
        item.includes("#") &&
        item.includes(assignmentNumber.toString()) &&
        item.includes("." + questionCount.toString())
      ) {
        checkInsideQuestionAnswer = true;
      } else if (
        item.includes("--") &&
        item.includes("finish") &&
        item.includes("#") &&
        item.includes(assignmentNumber.toString()) &&
        item.includes("." + questionCount.toString()) &&
        checkInsideQuestionAnswer
      ) {
        checkInsideQuestionAnswer = false;
        questionCount++;
        stringQuestionAnswer = stringQuestionAnswer.replace(/"/g, "'").trim();
        var splitData = stringQuestionAnswer.split(" ");
        if (splitData[0].toLowerCase() === "delete") {
          if (stringQuestionAnswer.slice(-1) === ";") {
            stringQuestionAnswer = stringQuestionAnswer.replace(/;/g, "");
          }
          stringQuestionAnswer += " returning * ;";
        } else if (stringQuestionAnswer.slice(-1) !== ";") {
          stringQuestionAnswer += ";";
        }
        arrayAnswer.push(stringQuestionAnswer);
        stringQuestionAnswer = "";
      } else if (checkInsideQuestionAnswer) {
        stringQuestionAnswer = stringQuestionAnswer + item + " ";
      }
      // console.log(item);
    }
    // console.log(arrayAnswer);
    if (arrayAnswer.length != noOfQuestion) {
      // console.log(arrayAnswer);
      reject("Format Submit File Not Correct");
    } else {
      resolve(arrayAnswer);
    }
  });
};

const getAnswerSolutionMysql = (databaseName, solution) => {
  var dateStart = Date.now();
  return new Promise((resolve, reject) => {
    if (solution === "") {
      reject({ time: Date.now() - dateStart, err: "Syntax Error" });
    }
    var knex = require("../utils/connection").mysqlCustom(databaseName);
    knex
      .raw(`BEGIN;${solution}ROLLBACK;`)
      .then(data => {
        // console.log(JSON.parse(JSON.stringify(sol)));
        for (let sol of data[0]) {
          if (_.isArray(sol)) {
            // console.log(sol);
            resolve({ time: Date.now() - dateStart, data: sol });
          }
        }
      })
      .catch(error => {
        // console.log("eiei");
        reject({ time: Date.now() - dateStart, err: "Syntax Error" });
      })
      .finally(function() {
        // To close the connection pool
        knex.destroy();
      });
  });
};

const getAnswerSolutionPg = (databaseName, solution) => {
  var dateStart = Date.now();
  return new Promise((resolve, reject) => {
    if (solution === "") {
      reject({ time: Date.now() - dateStart, err: "Syntax Error" });
    }
    var knex = require("../utils/connection").pgCustom(databaseName);
    knex
      .raw(`BEGIN;${solution}ROLLBACK;`)
      .then(data => {
        data.shift(); // Removes the first element from an array and returns
        // only that element.
        data.pop(); // Removes the last element from an array and returns
        // only that element.
        for (let sol of data) {
          if (sol.rows.length > 0) {
            resolve({ time: Date.now() - dateStart, data: sol.rows });
          }
        }
      })
      .catch(error => {
        console.log(error);
        reject({ time: Date.now() - dateStart, err: "Syntax Error" });
      })
      .finally(function() {
        // To close the connection pool
        knex.destroy();
      });
  });
};

const getAnswerSolutionMssql = (databaseName, solution) => {
  var dateStart = Date.now();
  return new Promise((resolve, reject) => {
    if (solution === "") {
      reject({ time: Date.now() - dateStart, err: "Syntax Error" });
    }
    var knex = require("../utils/connection").mssqlCustom(databaseName);
    knex
      .raw(`BEGIN TRANSACTION;${solution}ROLLBACK;`)
      .then(data => {
        // console.log(data);
        resolve({ time: Date.now() - dateStart, data: data });
      })
      .catch(error => {
        // console.log(error);
        reject({ time: Date.now() - dateStart, err: "Syntax Error" });
      })
      .finally(function() {
        // To close the connection pool
        knex.destroy();
      });
  });
};

const getScoreAnswer = (
  dataAnswer,
  databaseName,
  dbms,
  courseId,
  assignmentNumber
) => {
  return new Promise(async (resolve, reject) => {
    // console.log(dataAnswer);
    const lengthQuestion = dataAnswer.length;
    var data = await getAnswerSolution(databaseName, dataAnswer[0]);
    var dataAnswerFile = await checkSameAnswer(courseId, assignmentNumber, 1);
    // console.log(data);
    // console.log("--------------");
    // console.log(dataAnswerFile);
    // console.log(_.isEqual(data, dataAnswerFile));
    resolve(data);
  });
};

const getAnswerSolItem = (aid, index) => {
  return new Promise(async (resolve, reject) => {
    var data = await fs.readFile(
      `./assignments/${aid}/${index}/answer.json`,
      "utf8"
    );
    data = JSON.parse(data);
    // console.log(data);
    data = data.map(x => JSON.parse(x));
    await resolve(data);
  });
};

const getSolItem = (aid, index) => {
  return new Promise(async (resolve, reject) => {
    var data = await fs.readFile(
      `./assignments/${aid}/${index}/solution.sql`,
      "utf8"
    );
    await resolve(data);
  });
};

const getAnswerSolData = (aid, noofquestion) => {
  return new Promise(async (resolve, reject) => {
    var arrayAnswer = [];
    for (let index = 1; index <= noofquestion; index++) {
      var data = await getAnswerSolItem(aid, index);
      arrayAnswer = arrayAnswer.push(data);
    }
    await resolve(arrayAnswer);
  });
};

const getAnswerByStudent = (dbName, arrayData, dbms, aid) => {
  return new Promise(async (resolve, reject) => {
    var arrayAnswerByStudent = [];
    var questionNumber = 1;
    var timeExec = [];
    for (let data of arrayData) {
      var res = data.split(" ");
      if (
        res[0].toLocaleLowerCase() === "update" ||
        res[0].toLocaleLowerCase() === "insert"
      ) {
        var sol = await getSolItem(aid, questionNumber);
        var index = sol.indexOf(";");
        console.log("index" + index);
        var selectAfterCRUD = sol.substring(index + 1).trim();
        if (!selectAfterCRUD) {
          selectAfterCRUD = "null;";
        }
        data = data + selectAfterCRUD;
        console.log("data2" + data);
        // console.log(data);
      }
      // console.log(arrayAnswerByStudent);
      try {
        // console.log(questionNumber);
        if (dbms === "mysql") {
          var answer = await getAnswerSolutionMysql(dbName, data);
        } else if (dbms === "pg") {
          var answer = await getAnswerSolutionPg(dbName, data);
          console.log(answer);
        } else if (dbms === "sql") {
          var answer = await getAnswerSolutionMssql(dbName, data);
        }
        // console.log(answer);
        arrayAnswerByStudent = await arrayAnswerByStudent.concat(
          JSON.stringify(answer.data)
        );
        timeExec.push(answer.time);
      } catch (error) {
        arrayAnswerByStudent = await arrayAnswerByStudent.concat(error.err);
        timeExec.push(error.time);
      }
      questionNumber++;
    }
    // console.log(arrayAnswerByStudent);
    await resolve({ time: timeExec, data: arrayAnswerByStudent });
  });
};

const getCompareAnswer = (aid, spiltDataUser, answerUser) => {
  return new Promise(async (resolve, reject) => {
    var questionNumber = 1;
    var i = 0;
    var outputArray = [];
    var totalscore = 0;
    var score = await assignmentsModel.getScoresByAssignmentId(aid);
    // console.log(score);
    // console.log(answerUser);
    for (let solUser of answerUser) {
      if (solUser === "Syntax Error") {
        outputArray.push("Syntax Error");
        checkEqual = true;
        i = i + 1;
        questionNumber = questionNumber + 1;
        continue;
      }
      console.log(solUser);
      solUser = JSON.parse(solUser);
      solUser = solUser.map(x =>
        _.mapKeys(x, function(v, k) {
          return k.toLowerCase();
        })
      );
      // console.log(solUser);
      var allDataSol = await getAnswerSolItem(aid, questionNumber);
      // console.log(allDataSol);
      var solTeacher = await getSolItem(aid, questionNumber);
      var checkEqual = false;
      for (let solAnswer of allDataSol) {
        // console.log("--------------");
        if (!solAnswer) {
          continue;
        }
        solAnswer = solAnswer.map(x =>
          _.mapKeys(x, function(v, k) {
            return k.toLowerCase();
          })
        );
        // solAnswer = _.mapKeys(solAnswer, function(v, k) {
        //   return k.toLowerCase();
        // });
        if (solUser === "Syntax Error") {
          outputArray.push("Syntax Error");
          checkEqual = true;
          break;

          // _.isEqual(solUser, solAnswer);
        } else if (
          _(solUser)
            .differenceWith(solAnswer, _.isEqual)
            .isEmpty()
        ) {
          if (solTeacher.toLowerCase().includes("order by")) {
            console.log(solTeacher);
            if (_.isEqual(solUser, solAnswer)) {
              totalscore = totalscore + score[i].score;
              outputArray.push(score[i].score.toString());
              checkEqual = true;
            } else {
              checkEqual = false;
            }
            break;
          }
          totalscore = totalscore + score[i].score;
          outputArray.push(score[i].score.toString());
          checkEqual = true;
          break;
        }
      }
      if (!checkEqual) {
        outputArray.push("Output is incorrect");
      }
      i = i + 1;
      questionNumber = questionNumber + 1;
    }
    // await answerUser.forEach(async sol => {
    //   var dataSol = await getAnswerSolItem(aid, questionNumber);
    //   console.log(questionNumber);
    //   console.log(dataSol);
    //   // if (answerUser[i] === "Syntax Error") {
    //   //   outputArray.push("Syntax Error");
    //   // } else if (_.isEqual(sol, answerUser[i])) {
    //   //   outputArray.push(score[i].score.toString());
    //   // } else {
    //   //   outputArray.push("Output is incorrect");
    //   // }
    //   i = i + 1;
    //   questionNumber = questionNumber + 1;
    // });
    await resolve({ totalscore: totalscore, arr: outputArray });
  });
};

const scoreMergeAssignment = (dataAssignment, dataScore) => {
  return new Promise(async (resolve, reject) => {
    var i = 0;
    for (let dataA of dataAssignment) {
      for (let dataS of dataScore) {
        if (dataA.aid === dataS.aid) {
          dataAssignment[i].score = dataS.max;
        }
      }
      i = i + 1;
    }
    await resolve(dataAssignment);
  });
};

module.exports = {
  checkSameAnswer: checkSameAnswer,
  readlineAnswerSubmit: readlineAnswerSubmit,
  splitAnswerAlongNumberOfQuestion: splitAnswerAlongNumberOfQuestion,
  getScoreAnswer: getScoreAnswer,
  getAnswerSolData: getAnswerSolData,
  getAnswerByStudent: getAnswerByStudent,
  getCompareAnswer: getCompareAnswer,
  getSolItem: getSolItem,
  scoreMergeAssignment: scoreMergeAssignment
};
