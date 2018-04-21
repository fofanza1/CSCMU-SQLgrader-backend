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
        year: year,
        cstatus: "opening"
      })
      .returning("*")
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
      .orderBy("cstatus", "desc")
      .orderBy("year", "desc")
      .orderBy("semester", "desc")
      .select()
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getOpeningCourse = () => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("courses")
      .where("cstatus", "opening")
      .orderBy("year", "asc")
      .orderBy("semester", "desc")
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

const updateCourseStatus = (cid, newStatus) => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("courses")
      .where("cid", cid)
      .update({
        cstatus: newStatus
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const updateCourseData = (cid, ccode, cname, semester, year, cstatus) => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("courses")
      .where("cid", cid)
      .update({
        ccode: ccode,
        cname: cname,
        semester: semester,
        year: year,
        cstatus: cstatus
      })
      .then(data => {
        resolve({ msg: "update Course Successful" });
      })
      .catch(error => {
        reject({ msg: "update Course Failed" });
      });
  });
};

const getCoursesByStudentId = studentid => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("students_in_courses")
      .where("studentid", studentid)
      .select("cid")
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getCourseById = cid => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("courses")
      .where("cid", cid)
      .select()
      .then(data => {
        resolve(data[0]);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {
  addCourse: addCourse,
  viewAllCourse: viewAllCourse,
  deleteCourse: deleteCourse,
  getCoursesByStudentId: getCoursesByStudentId,
  getCourseById: getCourseById,
  getOpeningCourse: getOpeningCourse,
  updateCourseStatus: updateCourseStatus,
  updateCourseData: updateCourseData
};
