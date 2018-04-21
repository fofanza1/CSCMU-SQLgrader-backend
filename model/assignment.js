const knex = require("../utils/connection");
const exec = require("child_process").exec;
const PDFDocument = require("pdfkit");
var schedule = require("node-schedule");
const doc = new PDFDocument();
const fs = require("fs");
var mz = require("mz/fs");
var _ = require("lodash");
var moment = require("moment");

const createAssignment = (
  cid,
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
        cid: cid,
        anumber: anumber,
        aname: aname,
        noofquestion: noofquestion,
        startdate: startdate,
        duedate: duedate,
        dbid: dbid,
        totalscore: 0,
        astatus: "pedding"
      })
      .returning("aid")
      .then(data => {
        console.log(data);
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const createQuestion = (qnumber, aid, qdescription, score) => {
  return new Promise((resolve, reject) => {
    // const dataGrader = knex.pgGrader;
    knex
      .pgGrader("question_detail")
      .insert({
        qnumber: qnumber,
        aid: aid,
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

const sumScoreAssignment = aid => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("question_detail")
      .where("aid", aid)
      .sum("score")
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const updateScoreAssignment = (aid, newScore) => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("assignment_header")
      .where("aid", aid)
      .update("totalscore", newScore)
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const updateQuestionData = (qid, qdescription, newScore) => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("question_detail")
      .where("qid", qid)
      .update({
        qdescription: qdescription,
        score: newScore
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const CreatePDFdetailAssignment = () => {
  return new Promise(async (resolve, reject) => {
    //header วิชา
    await doc
      .pipe(fs.createWriteStream("output2.pdf"))
      .on("finish", function() {
        console.log("PDF closed");
      });

    await doc
      .font("public/fonts/THSarabun-Bold.ttf")
      .fontSize(16)
      .text(
        "204222 (2/2560)            Fundamentals of Database Systems             Assignment#1",
        {
          align: "center"
        }
      );

    //header ชื่อการบ้าน
    await doc
      .font("public/fonts/THSarabun-Bold.ttf")
      .fontSize(16)
      .text("Assignment#1 CompanyEiei", {
        align: "center"
      });
    //line
    await doc
      .save()
      .moveTo(70, 115)
      .lineTo(550, 115)
      .fill("#000000");
    // due date
    await doc
      .moveDown()
      .font("public/fonts/THSarabun-Bold.ttf")
      .fontSize(16)
      .fillColor("red")
      .text("กำหนดส่ง", {
        underline: true,
        continued: true
      });
    await doc
      .font("public/fonts/THSarabun.ttf")
      .fontSize(16)
      .text(" 7 March 1996 00:09", {
        underline: false
      });

    await doc
      .font("public/fonts/THSarabun.ttf")
      .fontSize(16)
      .fillColor("black")
      .text("คำสั่ง: จงเติมภาษาสอบถามตามที่โจทย์กำหนด");
    for (i = 1; i <= 9; i++) {
      await doc
        .moveDown()
        .font("public/fonts/THSarabun.ttf")
        .fontSize(16)
        .text(
          `${i})  วันหนึ่งฉันเดินเข้าป่าฉันเจอนกตัวหนึ่งมันถามฉันว่าจะไปไหนฉันจึงตอบอยากไปให้ไกลไกลเกินกว่าที่ฉันเคยไปถ้าเราเหนื่อยล้าจงเดินเข้าป่าอย่างน้อยก็ไม่ต้องพบเจอคนใจร้ายอย่างเธอคนที่ไม่มีน้ำใจไม่มีเยื่อใยให้คนเคยรักกันใจร้ายอย่างเธอต้องทิ้งให้อยู่คนเดียวเผื่อเธอเหงาขึ้นมาจะได้กลับมารักกันวันหนึ่งฉันเดินเข้าป่าฉันเจอเสือตัวใหญ่มันถามฉันว่ากลัวบ้างไหมฉันจึงตอบว่าไม่เท่าไรยังดีกว่าคนไร้หัวใจเมื่อเราปวดร้าวจงเดินเข้าป่าอย่างน้อยก็ไม่ต้องพบเจอคนใจร้ายอย่างเธอคนที่ไม่มีน้ำใจไม่มีเยื่อใยให้คนเคยรักกันใจร้ายอย่างเธอต้องทิ้งให้อยู่คนเดียวเผื่อเธอเหงาขึ้นมาจะได้กลับมารักกันคนใจร้ายคนใจร้ายไม่มีเยื่อใยให้คนเคยรักกันeieiวันหนึ่งฉันเดินเข้าป่า`,
          {
            align: "justify"
          }
        );
    }
    await doc.end();
    resolve("yes");
  });
};

const getDataAssignment = cid => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("assignment_header")
      .join("databases", "assignment_header.dbid", "=", "databases.dbid")
      .where("cid", cid)
      .select()
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getDataAssignmentByNumber = (cid, anumber) => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("assignment_header")
      .join("databases", "assignment_header.dbid", "=", "databases.dbid")
      .where({
        cid: cid,
        anumber: anumber
      })
      .select()
      .then(data => {
        console.log(data);
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getDataQuestion = (aid, qnumber) => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("question_detail")
      .where({
        aid: aid,
        qnumber: qnumber
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

const getAnswerSolutionMysql = (databaseName, solution) => {
  return new Promise((resolve, reject) => {
    console.log(solution);
    if (solution === "") {
      resolve("");
    }
    knex
      .mysqlCustom(databaseName)
      .raw(`BEGIN;${solution}ROLLBACK;`)
      .then(data => {
        // console.log(JSON.parse(JSON.stringify(sol)));
        for (let sol of data[0]) {
          if (_.isArray(sol)) {
            resolve(sol);
          }
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getAnswerSolutionPg = (databaseName, solution) => {
  return new Promise((resolve, reject) => {
    if (solution === "") {
      resolve("");
    }
    knex
      .pgCustom(databaseName)
      .raw(`BEGIN;${solution}ROLLBACK;`)
      .then(data => {
        data.shift(); // Removes the first element from an array and returns only that element.
        data.pop(); // Removes the last element from an array and returns only that element.
        for (let sol of data) {
          if (sol.rows.length > 0) {
            resolve(sol.rows);
          }
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getAnswerSolutionMssql = (databaseName, solution) => {
  return new Promise((resolve, reject) => {
    if (solution === "") {
      resolve("");
    }
    knex
      .mssqlCustom(databaseName)
      .raw(`BEGIN TRANSACTION;${solution}ROLLBACK;`)
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.log(error);
        resolve("");
      });
  });
};

const getAssignmentNumberByAssignmentId = aid => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("assignment_header")
      .where("aid", aid)
      .select("anumber")
      .then(data => {
        resolve(data[0].anumber);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getAssignmentByAssignmentId = aid => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("assignment_header")
      .where("aid", aid)
      .select()
      .then(data => {
        resolve(data[0]);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getScoresByAssignmentId = aid => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("question_detail")
      .where({ aid: aid })
      .select("score")
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const updateStatusAssignment = (aid, newStatus) => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("assignment_header")
      .where("aid", aid)
      .update("astatus", newStatus)
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const setOpeningAssignemnt = (aid, date) => {
  return new Promise(async (resolve, reject) => {
    const name = "opening" + aid;
    // const dateUnix = moment(date).format();
    // console.log(dateUnix);
    var j = await schedule.scheduleJob(name, date, async () => {
      // console.log("\n" + aid + "\n eiei");
      await updateStatusAssignment(aid, "opening");
    });
    resolve({ msg: "set Start Date" });
  });
};

const setClosedAssignemnt = (aid, date) => {
  return new Promise(async (resolve, reject) => {
    const name = "closed" + aid;
    var j = await schedule.scheduleJob(name, date, async () => {
      await updateStatusAssignment(aid, "closed");
    });
    resolve({ msg: "set Due Date" });
  });
};

module.exports = {
  createAssignment: createAssignment,
  createQuestion: createQuestion,
  sumScoreAssignment: sumScoreAssignment,
  updateScoreAssignment: updateScoreAssignment,
  CreatePDFdetailAssignment: CreatePDFdetailAssignment,
  getDataAssignment: getDataAssignment,
  getDataAssignmentByNumber: getDataAssignmentByNumber,
  getDataQuestion: getDataQuestion,
  updateQuestionData: updateQuestionData,
  getAnswerSolutionMysql: getAnswerSolutionMysql,
  getAnswerSolutionPg: getAnswerSolutionPg,
  getAnswerSolutionMssql: getAnswerSolutionMssql,
  getAssignmentNumberByAssignmentId: getAssignmentNumberByAssignmentId,
  getScoresByAssignmentId: getScoresByAssignmentId,
  setOpeningAssignemnt: setOpeningAssignemnt,
  setClosedAssignemnt: setClosedAssignemnt,
  getAssignmentByAssignmentId: getAssignmentByAssignmentId,
  updateStatusAssignment: updateStatusAssignment
};
