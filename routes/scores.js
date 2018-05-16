var express = require("express");
var router = express.Router();
var model = require("../model/score");
var taskModel = require("../model/task");
var courseModel = require("../model/course");
var controller = require("../controllers/score");

/* GET users listing. */
router.get("/getallscore/:aid", async (req, res, next) => {
  try {
    const getCorse = await courseModel.getCourseByAssignmentId(req.params.aid);
    console.log(getCorse);
    const getAllScore = await model.getAllScore(req.params.aid);
    console.log(getAllScore);
    const getAllDataStudentINCourse = await courseModel.getStudentInCourse(
      getCorse.cid
    );
    console.log(getAllDataStudentINCourse);
    const assignScore = await controller.assignScore(
      getAllScore,
      getAllDataStudentINCourse
    );
    console.log(assignScore);
    res.status(200).send(assignScore);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/viewsubmissions/:studentid/:aid", async (req, res, next) => {
  const studentid = req.params.studentid;
  try {
    const data = await taskModel.getSubmitAssignment(req.params.aid, studentid);
    res.send({ data: data, msg: "Send Submit Assigment Successful" });
    // res.send({ yes: data2, yes2: spiltData, getAnswerSol, answerUser });
  } catch (error) {
    res.send(error).status(500);
  }
});

router.get("/getdetailscore/:aid", async (req, res, next) => {
  var dataSubmitTimeCount = 0;
  var dataSystraxErrorCount = 0;
  var dataOutputisNotCorrectCount = 0;
  var dataCorrectCount = 0;
  try {
    // console.log(assignScore);
    const detailScore = await model.getSendSubmitTime(req.params.aid);
    dataSubmitTimeCount = detailScore[0].count;
    const questionId = await model.getQuestionIdByAissignmentId(req.params.aid);
    const systraxErrorCount = await model.systraxErrorCount(questionId);
    dataSystraxErrorCount = systraxErrorCount[0].count;
    const OutputisNotCorrectCount = await model.OutputisNotCorrectCount(
      questionId
    );
    dataOutputisNotCorrectCount = OutputisNotCorrectCount[0].count;
    const correctCount = await model.correctCount(questionId);
    dataCorrectCount = correctCount[0].count;
    res.status(200).send({
      submitCount: dataSubmitTimeCount,
      systraxErrorCount: dataSystraxErrorCount,
      OutputisIncorrectCount: dataOutputisNotCorrectCount,
      correctCount: dataCorrectCount
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
