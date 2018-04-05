var express = require("express");
const knex = require("../utils/connection");
var router = express.Router();
const model = require("../model/assignment");
const helper = require("../controllers/helper");
var CronJob = require("cron").CronJob;
// const Sequelize = require("sequelize");
// const sequelize = new Sequelize(
//   "postgres://postgres:cmugrader@127.0.0.1:5432/grader"
// );

// Load the full build.
var _ = require("lodash");
// Load the core build.
var _ = require("lodash/core");
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require("lodash/fp");

// Load method categories.
var array = require("lodash/array");
var object = require("lodash/fp/object");

// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
var at = require("lodash/at");
var curryN = require("lodash/fp/curryN");
var officegen = require("officegen");
var docx = officegen("docx");
var fs = require("mz/fs");
// out.on("close", function() {
//   console.log("Finished to create the PPTX file!");
// });
/* GET home page. */
router.get("/", async function(req, res, next) {
  // var out = fs.createWriteStream("out.docx");

  // var header = await docx.getHeader().createP();
  // await header.addText(
  //   "204222 (2/2560) \t Fundamentals of Database Systems \t Assignment#1",
  //   {
  //     font_face: "TH SarabunPSK",
  //     bold: true,
  //     font_size: 16,
  //     align: "center"
  //   }
  // );
  // var pObj = docx.createP();
  // await pObj.addText(`กำหนดส่ง`, {
  //   color: "#ff0000",
  //   font_face: "TH SarabunPSK",
  //   font_size: 16,
  //   bold: true,
  //   underline: true
  // });
  // await pObj.addText(`${Date.now()}`, {
  //   color: "#ff0000",
  //   font_face: "TH SarabunPSK",
  //   font_size: 16,
  //   bold: true
  // });
  // var pObj = docx.createP();
  // await pObj.addText(`คะแนนรวม`, {
  //   color: "#ff0000",
  //   font_face: "TH SarabunPSK",
  //   font_size: 16,
  //   bold: true,
  //   underline: true
  // });
  // await pObj.addText(` ${"30"} คะแนน`, {
  //   color: "#ff0000",
  //   font_face: "TH SarabunPSK",
  //   font_size: 16,
  //   bold: true
  // });
  // var pObj = docx.createP();
  // await pObj.addText(`คำสั่ง`, {
  //   color: "#ff0000",
  //   font_face: "TH SarabunPSK",
  //   font_size: 16,
  //   bold: true,
  //   underline: true
  // });
  // await pObj.addText(` จงเติมภาษาสอบถามตามที่โจทย์กําหนด`, {
  //   color: "#ff0000",
  //   font_face: "TH SarabunPSK",
  //   font_size: 16,
  //   bold: true
  // });
  // var pObj = docx.createListOfNumbers();
  // await pObj.addText(
  //   `1) วันหนึ่งฉันเดินเข้าป่าฉันเจอนกตัวหนึ่งมันถามฉันว่าจะไปไหนฉันจึงตอบอยากไปให้ไกลไกลเกินกว่าที่ฉันเคยไป
  // ถ้าเราเหนื่อยล้าจงเดินเข้าป่าอย่างน้อยก็ไม่ต้องพบเจอคนใจร้ายอย่างเธอคนที่ไม่มีน้ําใจไม่มีเยื่อใยให้คนเคยรักกันใ
  // จร้ายอย่างเธอต้องทิ้งให้อยู่คนเดียวเผื่อเธอเหงาขึ้นมาจะได้กลับมารักกันวันหนึ่งฉันเดินเข้าป่าฉันเจอเสือตัวใหญ่มัน
  // ถามฉันว่ากลัวบ้างไหมฉันจึงตอบว่าไม่เท่าไรยังดีกว่าคนไร้หัวใจเมื่อเราปวดร้าวจงเดินเข้าป่าอย่างน้อยก็ไม่ต้องพบเ
  // จอคนใจร้ายอย่างเธอคนที่ไม่มีน้ําใจไม่มีเยื่อใยให้คนเคยรักกันใจร้ายอย่างเธอต้องทิ้งให้อยู่คนเดียวเผื่อเธอเหงาขึ้นม
  // าจะได้กลับมารักกันคนใจร้ายคนใจร้ายไม่มีเยื่อใยให้คนเคยรักกันeieiวันหนึ่งฉันเดินเข้าป่า`,
  //   {
  //     font_face: "TH SarabunPSK",
  //     font_size: 16,
  //     align: "justify"
  //   }
  // );

  // var pObj = docx.createListOfNumbers();
  // await pObj.addText(
  //   `1) วันหนึ่งฉันเดินเข้าป่าฉันเจอนกตัวหนึ่งมันถามฉันว่าจะไปไหนฉันจึงตอบอยากไปให้ไกลไกลเกินกว่าที่ฉันเคยไป
  // ถ้าเราเหนื่อยล้าจงเดินเข้าป่าอย่างน้อยก็ไม่ต้องพบเจอคนใจร้ายอย่างเธอคนที่ไม่มีน้ําใจไม่มีเยื่อใยให้คนเคยรักกันใ
  // จร้ายอย่างเธอต้องทิ้งให้อยู่คนเดียวเผื่อเธอเหงาขึ้นมาจะได้กลับมารักกันวันหนึ่งฉันเดินเข้าป่าฉันเจอเสือตัวใหญ่มัน
  // ถามฉันว่ากลัวบ้างไหมฉันจึงตอบว่าไม่เท่าไรยังดีกว่าคนไร้หัวใจเมื่อเราปวดร้าวจงเดินเข้าป่าอย่างน้อยก็ไม่ต้องพบเ
  // จอคนใจร้ายอย่างเธอคนที่ไม่มีน้ําใจไม่มีเยื่อใยให้คนเคยรักกันใจร้ายอย่างเธอต้องทิ้งให้อยู่คนเดียวเผื่อเธอเหงาขึ้นม
  // าจะได้กลับมารักกันคนใจร้ายคนใจร้ายไม่มีเยื่อใยให้คนเคยรักกันeieiวันหนึ่งฉันเดินเข้าป่า`,
  //   {
  //     font_face: "TH SarabunPSK",
  //     font_size: 16,
  //     align: "justify"
  //   }
  // );

  // await await docx.generate(out);
  // out.on("close", function() {
  //   console.log("Finished to create the DOCX file!");
  // });
  var object = { d: 4, a: 1, b: 3, c: 3 };
  var other = { c: 3, a: 1, b: 3, d: 4 };
  var assignmentNumber = 1;
  var wstream = await fs.createWriteStream(
    `./assignments/${assignmentNumber}/submitFile.sql`
  );
  await wstream.write(`---------Assignment${assignmentNumber}----------\n\n`);
  for (i = 1; i <= 10; i++) {
    await wstream.write(`--start#${assignmentNumber}.${i}\n\n`);
    await wstream.write(`--finish#${assignmentNumber}.${i}\n\n`);
  }
  await wstream.end();
  res.send(_.isEqual(object, other));
  // res.send("eiei");
  // new CronJob(
  //   "* * * * * *",
  //   function() {
  //     console.log("You will see this message every second");
  //   },
  //   null,
  //   true,
  //   "Asia/Bangkok"
  // );
  // const data = model.CreatePDFdetailAssignment();

  // var object = {
  //   a: 1,
  //   b: 3,
  //   c: 3,
  //   d: {
  //     d: 4
  //   }
  // };
  // var other = { c: 3, a: 1, b: 3, d: 4 };
  // res.send(_.isEqual(object, other));
  // const data = await model.addDbNameintoServer("eieieeiie212111ei12222");
  // res.send(data);
  var knexGrader = knex.pgGrader;
  // var startDate = new Date();
  // await knexGrader.raw("BEGIN;");
  // await knexGrader
  //   .raw(
  //     "BEGIN;delete\t\n from assignment_header where anumber=44 returning *;ROLLBACK;"
  //   )
  //   .timeout(1000)
  //   .then(async data => {
  //     var endDate = new Date();
  //     var dataObj = data;
  //     dataObj.shift();
  //     dataObj.pop();
  //     // data.shift();
  //     // data.pop();
  //     await res.send(dataObj);
  //     // res.send({ data: data, time: endDate - startDate });
  //   })
  //   .catch(async error => {
  //     console.error(error);
  //     await knexGrader.raw("ROLLBACK;");
  //     await res.send("eiei");
  //     // res.send(error);
  //   });
  // const data = await helper.writeAssignmentSubmitFile(1, 20);
  // const pgp = require("pg-promise")({
  //   // Initialization Options
  // });
  // const cn = "postgres://postgres:cmusqlgrader@localhost:5432/grader";
  // const db = pgp(cn);
  // db
  //   .one(
  //     "insert into databases(dbname) values ('test323aaaaa') returning dbname;"
  //   )
  //   .then(function(data) {
  //     console.log(data);
  //     res.send(data);
  //   })
  //   .catch(function(error) {
  //     console.log(error);
  //     res.send(error);
  //   });
});

module.exports = router;
