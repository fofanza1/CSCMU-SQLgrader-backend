const knex = require("../utils/connection");
const exec = require("child_process").exec;
var fs = require("mz/fs");

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

const getSubmitAssignment = (aid, studentid) => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("student_get_score_from_assignment")
      .where({
        aid: aid,
        studentid: studentid
      })
      .select()
      .orderBy("scoreid", "desc")
      .then(data => {
        // console.log(data);
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getDataQuestionSubmit = scoreid => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("submit_question_in_assignment_score")
      .where({
        scoreid: scoreid
      })
      .join(
        "student_submit_question",
        "submit_question_in_assignment_score.submitid",
        "=",
        "student_submit_question.submitid"
      )
      .select("*")
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getQuestionId = aid => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("question_detail")
      .where({
        aid: aid
      })
      .select("qid", "qnumber")
      .orderBy("qnumber")
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const addSubmitQuestion = (
  qid_,
  timeExec,
  OutputArr,
  dateSubmit,
  studentid,
  spiltDataAnswer,
  scoreid
) => {
  return new Promise(async (resolve, reject) => {
    var i = 0;
    for (let data of qid_) {
      var dataQuestion = await addStudentSubmitQuestion(
        dateSubmit,
        timeExec[i],
        data.qid,
        OutputArr[i],
        studentid
      );
      var submitQuestionInAssignment = await addSubmitQuestionInAssignment(
        scoreid,
        dataQuestion.submitid
      );
      // await fs.writeFile(
      //   `./submit/${dataQuestion.submitid}.sql`,
      //   spiltDataAnswer[i]
      // );
      i = i + 1;
    }
    console.log();
    resolve({ msg: "add Submit Question" });
  });
};

const addSubmitQuestionInAssignment = (scoreid, submitid) => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("submit_question_in_assignment_score")
      .returning("*")
      .insert({
        scoreid: scoreid,
        submitid: submitid
      })
      .then(data => {
        resolve(data[0]);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const addStudentSubmitQuestion = (
  dateSubmit,
  submittime,
  qid,
  submitscore,
  studentid
) => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("student_submit_question")
      .returning("*")
      .insert({
        date: dateSubmit,
        submittime: submittime,
        qid: qid,
        submitscore: submitscore,
        studentid: studentid
      })
      .then(data => {
        resolve(data[0]);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getAssignmentInList = (cid, studentid) => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("assignment_header")
      .where({
        cid: cid
      })
      .whereNot("astatus", "pedding")
      .select()
      .orderBy("anumber")
      .then(data => {
        var anumberArray = [];
        for (let index = 0; index < data.length; index++) {
          data[index].score = 0;
          anumberArray.push(data[index].aid);
        }
        resolve({ data: data, assignmentNumber: anumberArray.sort() });
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getScoreInAssignmentList = (studentid, anumberArr) => {
  return new Promise((resolve, reject) => {
    console.log(anumberArr);
    knex
      .pgGrader("student_get_score_from_assignment")
      // .whereIn("aid", anumberArr)
      .where("studentid", studentid)
      .max("score")
      .select("aid")
      .groupBy("aid")
      .then(data => {
        // console.log(data);
        resolve(data);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

const addAssginmentScore = (totalScore, assignmentId, studentid) => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("student_get_score_from_assignment")
      .returning("*")
      .insert({
        studentid: studentid,
        aid: assignmentId,
        score: totalScore
      })
      .then(data => {
        resolve(data[0]);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {
  addSubmitAssignment: addSubmitAssignment,
  getSubmitAssignment: getSubmitAssignment,
  getQuestionId: getQuestionId,
  addSubmitQuestion: addSubmitQuestion,
  addAssginmentScore: addAssginmentScore,
  getAssignmentInList: getAssignmentInList,
  getScoreInAssignmentList: getScoreInAssignmentList,
  addSubmitQuestionInAssignment: addSubmitQuestionInAssignment,
  getDataQuestionSubmit: getDataQuestionSubmit
};
