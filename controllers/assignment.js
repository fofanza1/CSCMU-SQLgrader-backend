const model = require("../model/assignment");
var fs = require("fs");
var mz = require("mz/fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
var officegen = require("officegen");
var _ = require("lodash");

const initQuestion = async (assignmentNumber, noofQuestion) => {
  return new Promise(async (resolve, reject) => {
    try {
      var dir;
      var i;
      for (i = 1; i <= noofQuestion; i++) {
        dir = "./assignments/" + assignmentNumber + "/" + i;
        if (!mz.existsSync(dir)) {
          await mz.mkdirSync(dir);
          await writeFile(dir + "/solution.sql", "");
          await writeFile(dir + "/answer.json", "{}");
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

const getSoution = (assignmentNumber, questionNumber) => {
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
          var data = contents;
          // console.log(data);
          resolve({ answer: JSON.parse(data) });
        })
        .catch(err => console.error(err));
    } catch (error) {
      reject(error);
    }
  });
};

const genDocx = anumber => {
  return new Promise(async (resolve, reject) => {
    // console.log("eiei3");
    var docx = officegen("docx");
    const dataAssignment = await model.getDataAssignmentById(anumber);
    // console.log(dataAssignment);
    // console.log("eiei2");
    var header = await docx.getHeader().createP({ align: "center" });
    await header.addText(
      `204222 (2/2560) \t Fundamentals of Database Systems \t Assignment#${anumber}`,
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
      var dataQustion = await model.getDataQuestion(anumber, i);
      await pObj.addText(
        `${i}). (${dataQustion[0].score} คะแนน) ${dataQustion[0].qdescription}`,
        {
          font_face: "TH SarabunPSK",
          font_size: 16
        }
      );
    }
    var out = await mz.createWriteStream(
      `./assignments/${anumber}/problem.docx`
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

const genSubmitFile = (assignmentNumber, noofQuestion) => {
  return new Promise(async (resolve, reject) => {
    var wstream = await fs.createWriteStream(
      `./assignments/${assignmentNumber}/submitFile.sql`
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

module.exports = {
  initQuestion: initQuestion,
  getSoution: getSoution,
  getAnswer: getAnswer,
  genDocx: genDocx,
  genSubmitFile: genSubmitFile
};
