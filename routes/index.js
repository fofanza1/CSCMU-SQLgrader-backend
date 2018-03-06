var express = require("express");
const knex = require("../utils/connection");
var router = express.Router();
const model = require("../model/database");
const helper = require("../controllers/helper");
// const Sequelize = require("sequelize");
// const sequelize = new Sequelize(
//   "postgres://postgres:cmugrader@127.0.0.1:5432/grader"
// );

/* GET home page. */
router.get("/", async function(req, res, next) {
  //   const data = await model.addDbNameintoServer("eieieeiie212111ei12222");
  //   res.send(data);
  //   var knexGrader = knex.pgGrader;
  //   knexGrader.raw("select * from assignment_header;").then(data => {
  //     knexGrader.destroy();
  //     res.send(data);
  //   });
  const data = await helper.writeAssignmentSubmitFile(1, 20);
  res.send(data);
});

module.exports = router;
