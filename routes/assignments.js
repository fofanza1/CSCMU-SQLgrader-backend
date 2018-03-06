var express = require("express");
var router = express.Router();
const model = require("../model/assignment");
var lineno = 0;
/* GET home page. */
router.post("/createassignment", async function(req, res, next) {
  const assignmentNumber = req.body.anumber;
  const assignmentName = req.body.aname;
  const noofQuestion = req.body.noofquestion;
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
    await res.send(data);
  } catch (error) {
    await res.send(error);
  }
});

router.post("/createquestion", async (req, res, next) => {
  const qnumber = req.body.qnumber;
  const anumber = req.body.anumber;
  const qdescription = req.body.qdescription;
  const score = req.body.score;
  try {
    const data = await model.creteQuestion(
      qnumber,
      anumber,
      qdescription,
      score
    );
    const score_sum = await model.sumScoreAssignment(anumber);
    const updateScoreAssignment = await model.updateScoreAssignment(
      anumber,
      score_sum[0].sum
    );
    console.log(score_sum);
    await res.send({
      data: data,
      score: score_sum[0].sum,
      updateScoreAssignment: updateScoreAssignment
    });
  } catch (error) {
    console.log(error);
    await res.send(error);
  }
});

// router.post("/createquestion", async function(req, res, next) {
//   const questionNumber = req.body.qnumber;
//   const questionDescription = req.body.qdest;
//   const
// });

module.exports = router;
