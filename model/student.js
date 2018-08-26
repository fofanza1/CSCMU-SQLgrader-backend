const knex = require("../utils/connection");
const exec = require("child_process").exec;

const addStudent = (studentid, password, fullname) => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("students")
      .insert({ studentid: studentid, password: password, fullname: fullname })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const addStudentInCourse = (studentid, cid, section) => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("students_in_courses")
      .insert({ studentid: studentid, cid: cid, section: section })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getDataStudent = studentid => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("students")
      .where("studentid", studentid)
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
