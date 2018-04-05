var express = require("express");
var router = express.Router();
const controllers = require("../controllers/task");
var multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "submit/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".sql");
  }
});

var upload = multer({ storage: storage });

router.post(
  "/doassignment",
  upload.single("submitfile"),
  async (req, res, next) => {
    const submitFile = req.file;
    const assignmentNumber = req.body.anumber;
    const assignmentId = req.body.aid;
    const courseId = req.body.cid;
    const noofquestion = req.body.noofquestion;
    // res.send(dbName);
    // const qeustionNumber = req.body.qnumber;
    // console.log(submitFile);
    try {
      // const data = await controllers.checkSameAnswer(
      //   courseId,
      //   assignmentId,
      //   assignmentNumber,
      //   1
      // );
      const data2 = await controllers.readlineAnswerSubmit(submitFile.path);
      const data3 = await controllers.splitAnswerAlongNumberOfQuestion(
        data2,
        assignmentNumber,
        noofquestion
      );
      const data4 = await controllers.getScoreAnswer(
        data3,
        "company2",
        "psql",
        courseId,
        assignmentNumber
      );
      res.send(data4);
    } catch (error) {
      console.log(error);
      res.send(error).status(500);
    }
  }
);

module.exports = router;
