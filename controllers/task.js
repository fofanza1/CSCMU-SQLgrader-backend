var fs = require("mz/fs");
var readline = require("readline");
var officegen = require("officegen");
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
        questionCount++;
        checkInsideQuestionAnswer = false;
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

const getAnswerSolution = (databaseName, solution) => {
  return new Promise((resolve, reject) => {
    knex
      .mysqlCustom(databaseName)
      .raw(`BEGIN;${solution}ROLLBACK;`)
      .timeout(1000)
      .then(data => {
        resolve(JSON.parse(JSON.stringify(data[0][1])));
      })
      .catch(error => {
        console.log(error);
        reject(error);
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
    console.log(data);
    console.log("--------------");
    console.log(dataAnswerFile);
    console.log(_.isEqual(data, dataAnswerFile));
    resolve(data);
  });
};

module.exports = {
  checkSameAnswer: checkSameAnswer,
  readlineAnswerSubmit: readlineAnswerSubmit,
  splitAnswerAlongNumberOfQuestion: splitAnswerAlongNumberOfQuestion,
  getScoreAnswer: getScoreAnswer
};
