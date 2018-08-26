var express = require("express");
const model = require("../model/course");
var router = express.Router();

router.post("/addcourse", async (req, res, next) => {
  const ccode = req.body.ccode;
  const cname = req.body.cname;
  const semester = req.body.semester;
  const year = req.body.year;
  const numberofsection = parseInt(req.body.section);
  const status = "opening";
  try {
    const checkExist = await model.getCourseExist(ccode, semester, year);
    const data = await model.addCourse(
      ccode,
      cname,
      semester,
      year,
      status,
      numberofsection
    );
    await res.status(200).send({ msg: "Create Course Successful", data: data });
  } catch (error) {
    console.log(error);
    await res.status(500).send(error);
  }
});

router.post("/updatecourse", async (req, res, next) => {
  const ccode = req.body.ccode;
  const cname = req.body.cname;
  const semester = req.body.semester;
  const year = req.body.year;
  const cid = req.body.cid;
  const cstatus = req.body.cstatus;
  try {
    // const data = await model.getCourseById(cid);
    const checkExist = await model.getCourseExistUpdate(
      cid,
      ccode,
      semester,
      year
    );
    const updateData = await model.updateCourseData(
      cid,
      ccode,
      cname,
      semester,
      year,
      cstatus
    );
    res.status(200).send({ msg: "Update Course Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
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

router.get("/getsection/:courseid", async (req, res, next) => {
  try {
    const data = await model.getCourseSection(req.params.courseid);
    await res.status(200).send(data[0]);
  } catch (error) {
    await res.status(500).send(error);
  }
});

router.get("/getopeningcourse", async (req, res, next) => {
  try {
    const data = await model.getOpeningCourse();
    await res.status(200).send(data);
  } catch (error) {
    await res.status(500).send(error);
  }
});

router.post("/updatecoursestatus", async (req, res, next) => {
  const cid = req.body.cid;
  const currentCourseStatus = req.body.currentcoursestatus;
  try {
    if (currentCourseStatus == "opening") {
      const data = await model.updateCourseStatus(cid, "closed");
    } else {
      const data = await model.updateCourseStatus(cid, "opening");
    }
    res.send({ msg: "Update Course Status" });
  } catch (error) {
    console.log(error);
    await res.send(error).status(500);
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
