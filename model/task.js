const knex = require("../utils/connection");
const exec = require("child_process").exec;

const addSubmitAssignment = (
  date,
  submittime,
  aid,
  submitscore,
  detail,
  username
) => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("student_submit_assignment")
      .returning("*")
      .insert({
        date: date,
        submittime: submittime,
        aid: aid,
        submitscore: submitscore,
        detail: detail,
        username: username
      })
      .then(data => {
        resolve(data[0]);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getSubmitAssignment = (aid, username) => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("student_submit_assignment")
      .where({
        aid: aid,
        username: username
      })
      .select()
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {
  addSubmitAssignment: addSubmitAssignment,
  getSubmitAssignment: getSubmitAssignment
};
