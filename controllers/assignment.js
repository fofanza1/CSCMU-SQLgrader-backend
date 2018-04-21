const model = require("../model/assignment");
var fs = require("fs");
var mz = require("mz/fs");
var moment = require("moment");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
var officegen = require("officegen");
var _ = require("lodash");

const initQuestion = async (assignmentId, noofQuestion) => {
  return new Promise(async (resolve, reject) => {
    try {
      var dir;
      var i;
      for (i = 1; i <= noofQuestion; i++) {
        dir = "./assignments/" + assignmentId + "/" + i;
        if (!mz.existsSync(dir)) {
          await mz.mkdirSync(dir);
          await writeFile(dir + "/solution.sql", "");
          await writeFile(dir + "/answer.json", "[{}]");
        }
      }

      resolve("initQuestionSuccess");
    } catch (error) {
      reject({
        message: "initQuestionFailed",
        error: error
      });
    }
  });
};

const getSolution = (assignmentNumber, questionNumber) => {
  return new Promise(async (resolve, reject) => {
    dir = "./assignments/" + assignmentNumber + "/" + questionNumber;
    try {
      const file = await mz
        .readFile(dir + "/solution.sql", "utf8")
        .then(contents => {
          var data = contents;
          // console.log(contents);
          // console.log({ solution: data });
          resolve({ solution: data });
        })
        .catch(err => console.error(err));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const getAnswer = async (assignmentNumber, questionNumber) => {
  return new Promise(async (resolve, reject) => {
    dir = "./assignments/" + assignmentNumber + "/" + questionNumber;
    try {
      const file = await mz
        .readFile(dir + "/answer.json", "utf8")
        .then(contents => {
          var data = JSON.parse(contents);
          // console.log(data[0]);
          if (typeof data[0] !== "object") {
            resolve({ answer: JSON.parse(data[0]) });
          } else {
            if (_.isEmpty(data[0])) {
              resolve({ answer: data[0] });
            } else {
              resolve({ answer: JSON.stringify(data) });
            }
          }

          // resolve({ answer: data[0] });
        })
        .catch(err => console.error(err));
    } catch (error) {
      reject(error);
    }
  });
};

const genDocx = (courseData, anumber) => {
  return new Promise(async (resolve, reject) => {
    var docx = officegen("docx");
    const dataAssignment = await model.getDataAssignmentByNumber(
      courseData.cid,
      anumber
    );
    // console.log("eiei2");
    var header = await docx.getHeader().createP({ align: "center" });
    await header.addText(
      `${courseData.ccode} (${courseData.semester}/${courseData.year}) \t ${
        courseData.cname
      } \t Assignment#${anumber}`,
      {
        font_face: "TH SarabunPSK",
        bold: true,
        font_size: 16,
        align: "center"
      }
    );
    var pObj = docx.createP({ align: "center" });
    await pObj.addText(`Assignment#${anumber} ${dataAssignment[0].aname}`, {
      font_face: "TH SarabunPSK",
      font_size: 24,
      bold: true
    });
    var pObj = docx.createP();
    await pObj.addText(`กำหนดส่ง`, {
      color: "#ff0000",
      font_face: "TH SarabunPSK",
      font_size: 16,
      bold: true,
      underline: true
    });
    await pObj.addText(`${dataAssignment[0].duedate}`, {
      font_face: "TH SarabunPSK",
      font_size: 16,
      bold: true
    });
    var pObj = docx.createP();
    await pObj.addText(`คะแนนรวม`, {
      font_face: "TH SarabunPSK",
      font_size: 16,
      bold: true,
      underline: true
    });
    await pObj.addText(` ${dataAssignment[0].totalscore} คะแนน`, {
      font_face: "TH SarabunPSK",
      font_size: 16,
      bold: true
    });
    var pObj = docx.createP();
    await pObj.addText(`คำสั่ง จงเติมภาษาสอบถามตามที่โจทย์กําหนด`, {
      font_face: "TH SarabunPSK",
      font_size: 16,
      bold: true,
      underline: true
    });

    for (i = 1; i <= dataAssignment[0].noofquestion; i++) {
      var pObj = docx.createP();
      var dataQustion = await model.getDataQuestion(dataAssignment[0].aid, i);
      await pObj.addText(
        `${i}). (${dataQustion[0].score} คะแนน) ${dataQustion[0].qdescription}`,
        {
          font_face: "TH SarabunPSK",
          font_size: 16
        }
      );
    }
    var out = await mz.createWriteStream(
      `./assignments/${dataAssignment[0].aid}/problem.docx`
    );
    console.log("out");
    await docx.generate(out, {
      finalize: function(written) {
        console.log(
          "Finish to create a PowerPoint file.\nTotal bytes created: " +
            written +
            "\n"
        );
        resolve("Yes");
      },
      error: function(err) {
        console.log(err);
        reject(err);
      }
    });
    // res.send("eiei");
  });
};

const genSubmitFile = (assignmentId, assignmentNumber, noofQuestion) => {
  return new Promise(async (resolve, reject) => {
    var wstream = await fs.createWriteStream(
      `./assignments/${assignmentId}/submitFile.sql`
    );
    await wstream.write(
      `---------Assignment#${assignmentNumber}----------\n\n`
    );
    for (i = 1; i <= noofQuestion; i++) {
      await wstream.write(`--start#${assignmentNumber}.${i}\n\n`);
      await wstream.write(`--finish#${assignmentNumber}.${i}\n\n`);
    }
    await wstream.end();
    resolve({ yes: "yes" });
  });
};

const checkDataBeforeOpening = (aid, noofquestion) => {
  return new Promise(async (resolve, reject) => {
    var allSol = [];
    for (let index = 1; index <= noofquestion; index++) {
      var dataSol = await getSolution(aid, index);
      allSol.push(dataSol.solution);
    }

    if (allSol.includes("")) {
      resolve({ yes: "Yes" });
    } else {
      var dataAssignment = await model.getAssignmentByAssignmentId(aid);
      var startDate = moment(dataAssignment.startdate).format(
        "MMMM Do YYYY, h:mm:ss"
      );
      var dueDate = moment(dataAssignment.duedate).format(
        "MMMM Do YYYY, h:mm:ss"
      );
      var DateNow = moment().format("MMMM Do YYYY, h:mm:ss");
      if (DateNow < startDate) {
        const setStartDate = await model.setOpeningAssignemnt(
          aid,
          dataAssignment.startdate
        );
        const setDueDate = await model.setClosedAssignemnt(
          aid,
          dataAssignment.duedate
        );
        console.log("1 ", setStartDate, setDueDate);
      } else if (startDate <= DateNow && DateNow <= dueDate) {
        const setOpening = await model.updateStatusAssignment(aid, "opening");
        const setDueDate = await model.setClosedAssignemnt(
          aid,
          dataAssignment.duedate
        );
      } else {
        const setOpening = await model.updateStatusAssignment(aid, "closed");
      }
      resolve({ yes: "Yes" });
    }
  });
};

module.exports = {
  initQuestion: initQuestion,
  getSolution: getSolution,
  getAnswer: getAnswer,
  genDocx: genDocx,
  genSubmitFile: genSubmitFile,
  checkDataBeforeOpening: checkDataBeforeOpening
};
