var fs = require("mz/fs");
var readline = require("readline");
var officegen = require("officegen");
const assignmentsModel = require("../model/assignment");
const knex = require("../utils/connection");

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
        stringQuestionAnswer = stringQuestionAnswer.replace('"', "'");
        arrayAnswer.push(stringQuestionAnswer);
        stringQuestionAnswer = "";
      } else if (checkInsideQuestionAnswer) {
        stringQuestionAnswer = stringQuestionAnswer + item + " ";
      }
      // console.log(item);
    }
    // console.log(arrayAnswer);
    if (arrayAnswer.length != noOfQuestion) {
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
    knex
      .mysqlCustom(databaseName)
      .raw(`BEGIN;${solution}ROLLBACK;`)
      .then(data => {
        // console.log(JSON.parse(JSON.stringify(sol)));
        for (let sol of data[0]) {
          if (_.isArray(sol)) {
            resolve({ time: Date.now() - dateStart, data: sol });
          }
        }
      })
      .catch(error => {
        reject({ time: Date.now() - dateStart, err: "Syntax Error" });
      });
  });
};

const getAnswerSolutionPg = (databaseName, solution) => {
  var dateStart = Date.now();
  return new Promise((resolve, reject) => {
    if (solution === "") {
      reject({ time: Date.now() - dateStart, err: "Syntax Error" });
    }
    knex
      .pgCustom(databaseName)
      .raw(`BEGIN;${solution}ROLLBACK;`)
      .then(data => {
        data.shift(); // Removes the first element from an array and returns only that element.
        data.pop(); // Removes the last element from an array and returns only that element.
        for (let sol of data) {
          if (sol.rows.length > 0) {
            resolve({ time: Date.now() - dateStart, data: sol.rows });
          }
        }
      })
      .catch(error => {
        console.log(error);
        reject({ time: Date.now() - dateStart, err: "Syntax Error" });
      });
  });
};

const getAnswerSolutionMssql = (databaseName, solution) => {
  var dateStart = Date.now();
  return new Promise((resolve, reject) => {
    if (solution === "") {
      reject({ time: Date.now() - dateStart, err: "Syntax Error" });
    }
    knex
      .mssqlCustom(databaseName)
      .raw(`BEGIN TRANSACTION;${solution}ROLLBACK;`)
      .then(data => {
        // console.log(data);
        resolve({ time: Date.now() - dateStart, data: data });
      })
      .catch(error => {
        // console.log(error);
        reject({ time: Date.now() - dateStart, err: "Syntax Error" });
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
    var timeExec = 0;
    for (let data of arrayData) {
      var res = data.split(" ");
      if (
        res[0].toLocaleLowerCase() === "update" ||
        res[0].toLocaleLowerCase() === "insert"
      ) {
        var sol = await getSolItem(aid, questionNumber);
        var index = sol.indexOf(";");
        var selectAfterCRUD = sol.substring(index + 1).trim();
        // console.log(selectAfterCRUD);
        data = data + selectAfterCRUD;
        console.log(data);
      }
      // console.log(arrayAnswerByStudent);
      try {
        if (dbms === "mysql") {
          var answer = await getAnswerSolutionMysql(dbName, data);
        } else if (dbms === "pg") {
          var answer = await getAnswerSolutionPg(dbName, data);
        } else if (dbms === "sql") {
          var answer = await getAnswerSolutionMssql(dbName, data);
        }
        // console.log(answer);
        arrayAnswerByStudent = await arrayAnswerByStudent.concat(
          JSON.stringify(answer.data)
        );
        timeExec = timeExec + answer.time;
      } catch (error) {
        arrayAnswerByStudent = await arrayAnswerByStudent.concat(error.err);
        timeExec = timeExec + error.time;
      }
      questionNumber++;
    }
    // console.log(arrayAnswerByStudent);
    await resolve({ time: timeExec, data: arrayAnswerByStudent });
  });
};

const getCompareAnswer = (aid, answerUser) => {
  return new Promise(async (resolve, reject) => {
    var questionNumber = 1;
    var i = 0;
    var outputArray = [];
    var totalscore = 0;
    var score = await assignmentsModel.getScoresByAssignmentId(aid);
    // console.log(score);
    for (let solUser of answerUser) {
      var allDataSol = await getAnswerSolItem(aid, questionNumber);
      var checkEqual = false;
      for (let solAnswer of allDataSol) {
        // console.log(
        //   JSON.parse(solUser) +
        //     "\n ------------------- \n" +
        //     solAnswer +
        //     "\nend\n"
        // );
        // console.log(JSON.parse(solUser));
        // console.log(solAnswer);
        // console.log("-----------------");
        if (solUser === "Syntax Error") {
          outputArray.push("Syntax Error");
          checkEqual = true;
          break;
        } else if (_.isEqual(JSON.parse(solUser), solAnswer)) {
          totalscore = totalscore + score[i].score;
          outputArray.push(score[i].score.toString());
          checkEqual = true;
          console.log("eiei");
          break;
        }
        // } else {
        //   outputArray.push("Output is incorrect");
        // }
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

module.exports = {
  checkSameAnswer: checkSameAnswer,
  readlineAnswerSubmit: readlineAnswerSubmit,
  splitAnswerAlongNumberOfQuestion: splitAnswerAlongNumberOfQuestion,
  getScoreAnswer: getScoreAnswer,
  getAnswerSolData: getAnswerSolData,
  getAnswerByStudent: getAnswerByStudent,
  getCompareAnswer: getCompareAnswer,
  getSolItem: getSolItem
};
