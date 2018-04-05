var express = require("express");
const model = require("../model/course");
var router = express.Router();

router.post("/addcourse", async (req, res, next) => {
  const ccode = req.body.ccode;
  const cname = req.body.cname;
  const semester = req.body.semester;
  const year = req.body.year;
  try {
    const data = await model.addCourse(ccode, cname, semester, year);
    await res.status(200).send({ yes: data });
  } catch (error) {
    await res.status(500).send(error);
  }
});

router.get("/getallcourse", async (req, res, next) => {
  try {
    const data = await model.viewAllCourse();
    await res.status(200).send(data);
  } catch (error) {
    await res.status(500).send(error);
  }
});

router.post("/deletecourse", async (req, res, next) => {
  const cid = req.body.cid;
  try {
    const data = await model.deleteCourse(cid);
    await res.status(200).send({ yes: data });
  } catch (error) {
    await res.status(500).send(error);
  }
});

module.exports = router;
