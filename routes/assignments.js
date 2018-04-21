var express = require("express");
var router = express.Router();
const controller = require("../controllers/assignment");
const model = require("../model/assignment");
const courseModel = require("../model/course");
// var fs = require("fs");
var mz = require("mz/fs");
// Load the full build.
var _ = require("lodash");
var fs = require("mz/fs");

var lineno = 0;
/* GET home page. */
router.get("/dataassignment/:courseid", async function(req, res, next) {
  try {
    const data = await model.getDataAssignment(req.params.courseid);
    await res.send(data);
  } catch (error) {
    await res.send(error);
  }
});

router.get("/downloadassignment/:aid", function(req, res) {
  res.download(
    "./assignments/" + req.params.aid + "/problem.docx",
    "assignment" + req.params.aid + ".docx"
  );
});

router.get("/downloadscript/:aid", function(req, res) {
  res.download(
    "./assignments/" + req.params.aid + "/submitFile.sql",
    "task" + req.params.aid + ".sql"
  );
});

router.get("/getassignment/:courseid/:anumber", async function(req, res, next) {
  try {
    const data = await model.getDataAssignmentByNumber(
      req.params.courseid,
      req.params.anumber
    );
    await res.json(data);
  } catch (error) {
    await res.send(error);
  }
});

router.get("/getquestion/:courseid/:anumber", async function(req, res, next) {
  try {
    var Alldata = [];
    const dataAssignment = await model.getDataAssignmentByNumber(
      req.params.courseid,
      req.params.anumber
    );
    // console.log(dataAssignment[0].noofquestion);
    // var noofQuestionArr = await _.range(1, dataAssignment[0].noofquestion + 1);
    for (i = 1; i <= dataAssignment[0].noofquestion; i++) {
      var data = await model.getDataQuestion(dataAssignment[0].aid, i);
      var getSolution = await controller.getSolution(dataAssignment[0].aid, i);
      var getAnswer = await controller.getAnswer(dataAssignment[0].aid, i);
      await Alldata.push(Object.assign(data[0], getSolution, getAnswer));
    }
    // await noofQuestionArr.forEach(async i => {
    //   var data = await model.getDataQuestion(req.params.anumber, i);
    //   var getSolution = await controller.getSolution(req.params.anumber, i);
    //   var getAnswer = await controller.getAnswer(req.params.anumber, i);
    //   await Alldata.push(Object.assign(data[0], getSolution, getAnswer));
    // });
    // const data = await model.getDataQuestion(
    //   req.params.anumber,
    //   req.params.qnumber
    // );
    // const getSolution = await controller.getSolution(
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
  const cid = req.body.cid;
  const assignmentNumber = req.body.anumber;
  const assignmentName = req.body.aname;
  const noofQuestion = parseInt(req.body.noofquestion);
  const startDate = req.body.startdate;
  const dueDate = req.body.duedate;
  const DatabaseId = req.body.dbid;

  try {
    const data = await model.createAssignment(
      cid,
      assignmentNumber,
      assignmentName,
      noofQuestion,
      startDate,
      dueDate,
      DatabaseId
    );
    var assignmentId = data[0];
    // var setStartDate = await model.setOpeningAssignemnt(
    //   assignmentId,
    //   startDate
    // );
    // var setDueDate = await model.setClosedAssignemnt(assignmentId, dueDate);
    var dir = "./assignments/" + assignmentId;
    if (!mz.existsSync(dir)) {
      await mz.mkdirSync(dir);
    }
    await controller.initQuestion(assignmentId, noofQuestion);
    var noofQuestionArr = await _.range(1, noofQuestion + 1);
    noofQuestionArr.forEach(async i => {
      var test = await model.createQuestion(i, assignmentId, "", 0);
    });
    await controller.genSubmitFile(
      assignmentId,
      assignmentNumber,
      noofQuestion
    );
    await res.json({ yes: "yes" });
  } catch (error) {
    await res.status(500).send(error);
  }
});

router.post("/updatequestion", async (req, res, next) => {
  const cid = req.body.cid;
  const qid = req.body.qid;
  const qnumber = req.body.qnumber;
  const aid = req.body.aid;
  const noofQuestion = req.body.noofquestion;
  const qdescription = req.body.qdescription;
  var qsolution = req.body.qsolution;
  qsolution = qsolution.replace('"', "'");
  const score = req.body.score;
  const dbName = req.body.dbname;
  try {
    const data = await model.updateQuestionData(qid, qdescription, score);
    const score_sum = await model.sumScoreAssignment(aid);
    const updateScoreAssignment = await model.updateScoreAssignment(
      aid,
      score_sum[0].sum
    );
    await fs.writeFile(
      `./assignments/${aid}/${qnumber}/solution.sql`,
      qsolution
    );
    const courseData = await courseModel.getCourseById(cid);
    const anumber = await model.getAssignmentNumberByAssignmentId(aid);
    await controller.genDocx(courseData, anumber);
    await controller.genSubmitFile(aid, anumber, noofQuestion);
    var arraySol = [];
    const solMysql = await model.getAnswerSolutionMysql(dbName, qsolution);
    const solPg = await model.getAnswerSolutionPg(dbName, qsolution);
    const solMssql = await model.getAnswerSolutionMssql(dbName, qsolution);
    await arraySol.push(JSON.stringify(solMysql));
    await arraySol.push(JSON.stringify(solPg));
    await arraySol.push(JSON.stringify(solMssql));
    await fs.writeFile(
      `./assignments/${aid}/${qnumber}/answer.json`,
      JSON.stringify(arraySol),
      "utf8"
    );
    const checkData = await controller.checkDataBeforeOpening(
      aid,
      noofQuestion
    );
    // console.log(arraySol);

    await res.send({
      data: data,
      score: score_sum[0].sum,
      updateScoreAssignment: updateScoreAssignment,
      sol: arraySol
    });
  } catch (error) {
    await fs.writeFile(`./assignments/${aid}/${qnumber}/solution.sql`, "");
    await fs.writeFile(
      `./assignments/${aid}/${qnumber}/answer.json`,
      "[{}]",
      "utf8"
    );
    console.log(error);
    await res.status(500).send(error);
  }
});

module.exports = router;
