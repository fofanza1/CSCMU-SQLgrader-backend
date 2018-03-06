const knex = require("../utils/connection");
const exec = require("child_process").exec;

const createAssignment = (
  anumber,
  aname,
  noofquestion,
  startdate,
  duedate,
  dbid
) => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("assignment_header")
      .insert({
        anumber: anumber,
        aname: aname,
        noofquestion: noofquestion,
        startdate: startdate,
        duedate: duedate,
        dbid: dbid,
        totalscore: 0,
        astatus: "pedding"
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const creteQuestion = (qnumber, anumber, qdescription, score) => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("question_detail")
      .insert({
        qnumber: qnumber,
        anumber: anumber,
        qdescription: qdescription,
        score: score
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const sumScoreAssignment = anumber => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("question_detail")
      .where("anumber", anumber)
      .sum("score")
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const updateScoreAssignment = (anumber, newScore) => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("assignment_header")
      .where("anumber", anumber)
      .update("totalscore", newScore)
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {
  createAssignment: createAssignment,
  creteQuestion: creteQuestion,
  sumScoreAssignment: sumScoreAssignment,
  updateScoreAssignment: updateScoreAssignment
};
