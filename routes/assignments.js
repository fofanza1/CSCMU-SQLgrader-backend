var express = require("express");
var router = express.Router();
const controller = require("../controllers/assignment");
const model = require("../model/assignment");
// var fs = require("fs");
var mz = require("mz/fs");
// Load the full build.
var _ = require("lodash");
var fs = require("mz/fs");

var lineno = 0;
/* GET home page. */
router.get("/dataassignment", async function(req, res, next) {
  try {
    const data = await model.getDataAssignment();
    await res.send(data);
  } catch (error) {
    await res.send(error);
  }
});

router.get("/getassignment/:anumber", async function(req, res, next) {
  try {
    const data = await model.getDataAssignmentById(req.params.anumber);
    await res.json(data);
  } catch (error) {
    await res.send(error);
  }
});

router.get("/getquestion/:anumber", async function(req, res, next) {
  try {
    var Alldata = [];
    const dataAssignment = await model.getDataAssignmentById(
      req.params.anumber
    );
    // console.log(dataAssignment[0].noofquestion);
    // var noofQuestionArr = await _.range(1, dataAssignment[0].noofquestion + 1);
    for (i = 1; i <= dataAssignment[0].noofquestion; i++) {
      var data = await model.getDataQuestion(req.params.anumber, i);
      var getSoution = await controller.getSoution(req.params.anumber, i);
      var getAnswer = await controller.getAnswer(req.params.anumber, i);
      await Alldata.push(Object.assign(data[0], getSoution, getAnswer));
    }
    // await noofQuestionArr.forEach(async i => {
    //   var data = await model.getDataQuestion(req.params.anumber, i);
    //   var getSoution = await controller.getSoution(req.params.anumber, i);
    //   var getAnswer = await controller.getAnswer(req.params.anumber, i);
    //   await Alldata.push(Object.assign(data[0], getSoution, getAnswer));
    // });
    // const data = await model.getDataQuestion(
    //   req.params.anumber,
    //   req.params.qnumber
    // );
    // const getSoution = await controller.getSoution(
    //   req.params.anumber,
    //   req.params.qnumber
    // );
    // const getAnswer = await controller.getAnswer(
    //   req.params.anumber,
    //   req.params.qnumber
    // );
    await res.json(Alldata).status(200);
  } catch (error) {
    await res.send(error);
  }
});

router.post("/createassignment", async function(req, res, next) {
  const assignmentNumber = req.body.anumber;
  const assignmentName = req.body.aname;
  const noofQuestion = parseInt(req.body.noofquestion);
  const startDate = req.body.startdate;
  const dueDate = req.body.duedate;
  const DatabaseId = req.body.dbid;

  try {
    const data = await model.createAssignment(
      assignmentNumber,
      assignmentName,
      noofQuestion,
      startDate,
      dueDate,
      DatabaseId
    );
    var dir = "./assignments/" + assignmentNumber;
    if (!mz.existsSync(dir)) {
      await mz.mkdirSync(dir);
    }
    await controller.initQuestion(assignmentNumber, noofQuestion);
    var noofQuestionArr = await _.range(1, noofQuestion + 1);
    noofQuestionArr.forEach(async i => {
      // console.log(i);
      var test = await model.createQuestion(i, assignmentNumber, "", 0);
    });
    await controller.genSubmitFile(assignmentNumber, noofQuestion);
    // for (let i = 1; i <= parseInt(noofQuestion); i++) {
    //   var test = await model.creteQuestion(i, assignmentNumber, "", 0);
    // }
    await res.jso({ yes: "yes" });
  } catch (error) {
    await res.send(error);
  }
});

router.post("/updatequestion", async (req, res, next) => {
  const cid = req.body.cid;
  const qid = req.body.qid;
  const qnumber = req.body.qnumber;
  const anumber = req.body.anumber;
  const qdescription = req.body.qdescription;
  const qsolution = req.body.qsolution;
  const score = req.body.score;
  try {
    const data = await model.updateQuestionData(qid, qdescription, score);
    const score_sum = await model.sumScoreAssignment(anumber);
    const updateScoreAssignment = await model.updateScoreAssignment(
      anumber,
      score_sum[0].sum
    );
    await fs.writeFile(
      `./assignments/${anumber}/${qnumber}/solution.sql`,
      qsolution
    );
    const sol = await model.getAnswerSolution("company3", qsolution);
    await fs.writeFile(
      `./assignments/${anumber}/${qnumber}/answer.json`,
      JSON.stringify(sol),
      "utf8"
    );
    console.log("eiei4");
    await controller.genDocx(anumber);
    // await controller.genSubmitFile(anumber, noofQuestion);
    await res.send({
      data: data,
      score: score_sum[0].sum,
      updateScoreAssignment: updateScoreAssignment,
      sol: sol
    });
  } catch (error) {
    console.log(error);
    await res.send(error).status(500);
  }
});

module.exports = router;
