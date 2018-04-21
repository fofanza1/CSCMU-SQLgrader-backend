var express = require("express");
var router = express.Router();
const controllers = require("../controllers/task");
const model = require("../model/task");
var moment = require("moment");
var multer = require("multer");
var fs = require("mz/fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "submit/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".sql");
  }
});

var upload = multer({ storage: storage });

router.get("/submissions/:aid", async (req, res, next) => {
  const username = req.headers.authorization;
  console.log(username);
  try {
    const data = await model.getSubmitAssignment(req.params.aid, username);
    res.send({ data: data, msg: "Send Submit Assigment Successful" });
    // res.send({ yes: data2, yes2: spiltData, getAnswerSol, answerUser });
  } catch (error) {
    res.send(error).status(500);
  }
});

router.get("/submissions/submitfile/:submitid", async (req, res, next) => {
  const username = "meice147";
  try {
    res.download("./submit/" + req.params.submitid + ".sql", "submitfile.sql");
    // res.send({ yes: data2, yes2: spiltData, getAnswerSol, answerUser });
  } catch (error) {
    res.send(error).status(500);
  }
});

router.post(
  "/doassignment",
  upload.single("submitfile"),
  async (req, res, next) => {
    const submitFile = req.file;
    const assignmentNumber = req.body.anumber;
    const assignmentId = req.body.aid;
    const courseId = req.body.cid;
    const dbms = req.body.dbms;
    const dbName = req.body.dbname;
    const noofquestion = parseInt(req.body.noofquestion);
    const dateSubmit = moment().format();
    const username = req.body.username;
    console.log(submitFile);
    try {
      const data2 = await controllers.readlineAnswerSubmit(submitFile.path);
      const spiltData = await controllers.splitAnswerAlongNumberOfQuestion(
        data2,
        assignmentNumber,
        noofquestion
      );
      const answerUser = await controllers.getAnswerByStudent(
        dbName,
        spiltData,
        dbms,
        assignmentId
      );
      const compareAnswer = await controllers.getCompareAnswer(
        assignmentId,
        answerUser.data
      );
      var totalScore = compareAnswer.totalscore;
      var timeExec = answerUser.time;
      var OutputArr = compareAnswer.arr;
      const submitDetail = await model.addSubmitAssignment(
        dateSubmit,
        timeExec,
        assignmentId,
        totalScore,
        OutputArr,
        username
      );
      await fs.rename(
        submitFile.path,
        submitFile.destination + submitDetail.submitid + ".sql"
      );

      res.send({ msg: "Send Submit Assigment Successful" });
      // res.send({ yes: data2, yes2: spiltData, getAnswerSol, answerUser });
    } catch (error) {
      console.log(error);
      res.send(error).status(500);
    }
  }
);

module.exports = router;
