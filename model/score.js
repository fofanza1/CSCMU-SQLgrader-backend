const knex = require("../utils/connection");
const exec = require("child_process").exec;
var fs = require("mz/fs");

const getAllScore = aid => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("student_get_score_from_assignment")
      .distinct("student_get_score_from_assignment.studentid")
      .max("score")
      .groupBy("student_get_score_from_assignment.studentid")
      .where({
        aid: aid
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getSendSubmitTime = aid => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("student_get_score_from_assignment")
      .count("aid")
      .where({
        aid: aid
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getQuestionIdByAissignmentId = aid => {
  return new Promise(async (resolve, reject) => {
    knex
      .pgGrader("question_detail")
      .where("aid", aid)
      .select("qid")
      .then(data => {
        var result = [];
        for (let data_ of data) {
          result.push(data_.qid);
        }
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const systraxErrorCount = questionId => {
  return new Promise(async (resolve, reject) => {
    knex
      .pgGrader("student_submit_question")
      .whereIn("qid", questionId)
      .andWhere("submitscore", "Syntax Error")
      .count("*")
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const OutputisNotCorrectCount = questionId => {
  return new Promise(async (resolve, reject) => {
    knex
      .pgGrader("student_submit_question")
      .whereIn("qid", questionId)
      .andWhere("submitscore", "Output is incorrect")
      .count("*")
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const correctCount = questionId => {
  return new Promise(async (resolve, reject) => {
    knex
      .pgGrader("student_submit_question")
      .whereIn("qid", questionId)
      .andWhereNot("submitscore", "Output is incorrect")
      .andWhereNot("submitscore", "Syntax Error")
      .count("*")
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {
  getAllScore: getAllScore,
  getSendSubmitTime: getSendSubmitTime,
  getQuestionIdByAissignmentId: getQuestionIdByAissignmentId,
  systraxErrorCount: systraxErrorCount,
  OutputisNotCorrectCount: OutputisNotCorrectCount,
  correctCount: correctCount
};
