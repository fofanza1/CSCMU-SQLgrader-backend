var express = require("express");
var router = express.Router();
const model = require("../model/student");
const controller = require("../controllers/student.js");
const courseModel = require("../model/course");
var jwt = require("jsonwebtoken");

router.post("/registerstudent", async (req, res, next) => {
  const password = req.body.password;
  const studentid = req.body.studentid;
  const fullname = req.body.fullname;
  const cid = req.body.cid;
  try {
    const hashPassword = await controller.hashPassword(password);
    console.log(hashPassword);
    const addStudent = await model.addStudent(
      studentid,
      hashPassword,
      fullname
    );
    console.log(addStudent);
    const addStudentInCourse = await model.addStudentInCourse(studentid, cid);
    res.status(200).send({ yes: "yes" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Username is exist");
  }
  // const addStudent = await
});

router.post("/login", async (req, res, next) => {
  const studentid = req.body.studentid;
  const password = req.body.password;
  try {
    const data = await model.getDataStudent(studentid);
    const checkPassword = await controller.checkPassword(
      password,
      data.password
    );
    delete data.password;
    const jwtToken = await controller.genToken(data);
    const courseId = await courseModel.getCoursesByStudentId(studentid);
    res.status(200).send({
      token: jwtToken,
      name: data.fullname,
      courseid: courseId[0].cid
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("login failed");
  }
  // const addStudent = await
});

module.exports = router;
