const knex = require("../utils/connection");
const exec = require("child_process").exec;

const addStudent = (username, password, studentid, fullname) => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("students")
      .insert({
        username: username,
        password: password,
        studentid: studentid,
        fullname: fullname
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const addStudentInCourse = (username, cid) => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("students_in_courses")
      .insert({
        username: username,
        cid: cid
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getDataStudent = username => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("students")
      .where("username", username)
      .select()
      .then(data => {
        console.log(data);
        if (data) {
          resolve(data[0]);
        }
        reject(false);
      })
      .catch(error => {
        // console.log(error);
        reject(error);
      });
  });
};

module.exports = {
  addStudent: addStudent,
  addStudentInCourse: addStudentInCourse,
  getDataStudent: getDataStudent
};
