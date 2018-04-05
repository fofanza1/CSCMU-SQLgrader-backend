const knex = require("../utils/connection");
const exec = require("child_process").exec;

const addCourse = (ccode, cname, semester, year) => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("courses")
      .insert({
        ccode: ccode,
        cname: cname,
        semester: semester,
        year: year
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const viewAllCourse = () => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("courses")
      .select()
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const deleteCourse = cid => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("courses")
      .where("cid", cid)
      .del()
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {
  addCourse: addCourse,
  viewAllCourse: viewAllCourse,
  deleteCourse: deleteCourse
};
