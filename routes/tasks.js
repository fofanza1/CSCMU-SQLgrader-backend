var express = require("express");
var router = express.Router();
const controllers = require("../controllers/task");
const model = require("../model/task");
var moment = require("moment");
var multer = require("multer");
var fs = require("mz/fs");
var _ = require("lodash");

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
  const studentid = req.headers.authorization;
  try {
    const data = await model.getSubmitAssignment(req.params.aid, studentid);
    res.send({ data: data, msg: "Send Submit Assigment Successful" });
    // res.send({ yes: data2, yes2: spiltData, getAnswerSol, answerUser });
  } catch (error) {
    res.send(error).status(500);
  }
});

router.get("/test", async (req, res, next) => {
  var a = [{ a: 3, c: 5 }, { b: 4 }];
  var b = [{ b: 4 }, { a: 3 }];
  // _.isEqual(a, b);
  res.send(_.differenceWith(a, b, _.isEqual));
});

router.get("/assignmentlist/:cid", async (req, res, next) => {
  const studentid = req.headers.authorization;
  console.log(studentid);
  try {
    const dataAssignment = await model.getAssignmentInList(
      req.params.cid,
      studentid
    );
    // console.log(dataAssignment);
    const dataScore = await model.getScoreInAssignmentList(
      studentid,
      dataAssignment.assignmentNumber
    );
    // console.log(dataScore);
    const scoreMerge = await controllers.scoreMergeAssignment(
      dataAssignment.data,
      dataScore
    );
    res.send({
      data: dataAssignment,
      msg: "Send Get Assignment List Successful"
    });
    // res.send({ yes: data2, yes2: spiltData, getAnswerSol, answerUser });
  } catch (error) {
    res.send(error).status(500);
  }
});

router.get("/submissions/submitfile/:submitid", async (req, res, next) => {
  // const username = "meice147";
  try {
    res.download("./submit/" + req.params.submitid + ".sql", "submitfile.sql");
    // res.send({ yes: data2, yes2: spiltData, getAnswerSol, answerUser });
  } catch (error) {
    res.send(error).status(500);
  }
});

router.get("/submissions/detail/:submitid", async (req, res, next) => {
  // const username = "meice147";
  try {
    const data = await model.getDataQuestionSubmit(req.params.submitid);
    res.status(200).send(data);
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
    const studentid = req.headers.authorization;
    console.log(studentid);
    try {
      const data2 = await controllers.readlineAnswerSubmit(submitFile.path);
      const spiltData = await controllers.splitAnswerAlongNumberOfQuestion(
        data2,
        assignmentNumber,
        noofquestion
      );
      // console.log(spiltData);
      // console.log(spiltData);
      const answerUser = await controllers.getAnswerByStudent(
        dbName,
        spiltData,
        dbms,
        assignmentId
      );
      // console.log(answerUser);
      // console.log(spiltData);
      const compareAnswer = await controllers.getCompareAnswer(
        assignmentId,
        spiltData,
        answerUser.data
      );
      console.log(compareAnswer);
      var totalScore = compareAnswer.totalscore;
      var timeExec = answerUser.time;
      var OutputArr = compareAnswer.arr;
      var qid_ = await model.getQuestionId(assignmentId);
      const addAssginmentScore = await model.addAssginmentScore(
        totalScore,
        assignmentId,
        studentid
      );
      const submitDetail = await model.addSubmitQuestion(
        qid_,
        timeExec,
        OutputArr,
        dateSubmit,
        studentid,
        spiltData,
        addAssginmentScore.scoreid
      );
      // await fs.unlink(submitFile.path);
      // const submitDetail = await model.addSubmitAssignment(
      //   dateSubmit,
      //   timeExec,
      //   assignmentId,
      //   totalScore,
      //   OutputArr,
      //   username
      // );
      await fs.rename(
        submitFile.path,
        submitFile.destination + addAssginmentScore.scoreid + ".sql"
      );

      res.send({ msg: "Send Submit Assigment Successful" });
      // res.send({ yes: data2, yes2: spiltData, getAnswerSol, answerUser });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

module.exports = router;
