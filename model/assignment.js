const knex = require("../utils/connection");
const exec = require("child_process").exec;
const PDFDocument = require("pdfkit");
const doc = new PDFDocument();
const fs = require("fs");
var mz = require("mz/fs");

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

const createQuestion = (qnumber, anumber, qdescription, score) => {
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

const updateQuestionData = (qid, qdescription, newScore) => {
  console.log(qid, qdescription, newScore);
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

const getDataAssignment = () => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("assignment_header")
      .select()
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getDataAssignmentById = anumber => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("assignment_header")
      .where({
        anumber: anumber
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

const getDataQuestion = (anumber, qnumber) => {
  return new Promise((resolve, reject) => {
    knex
      .pgGrader("question_detail")
      .where({
        anumber: anumber,
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

const getAnswerSolution = (databaseName, solution) => {
  return new Promise((resolve, reject) => {
    knex
      .mysqlCustom(databaseName)
      .raw(`BEGIN;${solution}ROLLBACK;`)
      .then(data => {
        resolve(data[0][1]);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

module.exports = {
  createAssignment: createAssignment,
  createQuestion: createQuestion,
  sumScoreAssignment: sumScoreAssignment,
  updateScoreAssignment: updateScoreAssignment,
  CreatePDFdetailAssignment: CreatePDFdetailAssignment,
  getDataAssignment: getDataAssignment,
  getDataAssignmentById: getDataAssignmentById,
  getDataQuestion: getDataQuestion,
  updateQuestionData: updateQuestionData,
  getAnswerSolution: getAnswerSolution
};
