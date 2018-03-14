const model = require("../model/assignment");
var fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const initQuestion = async (assignmentNumber, noofQuestion) => {
  return new Promise(async (resolve, reject) => {
    try {
      var dir;
      var i;
      for (i = 1; i <= noofQuestion; i++) {
        dir = "./assignments/" + assignmentNumber + "/" + i;
        if (!fs.existsSync(dir)) {
          await fs.mkdirSync(dir);
          await writeFile(dir + "/solution.sql", "");
          await writeFile(dir + "/answer.json", "");
          //   await model.creteQuestion(i, assignmentNumber, "", 0);
        }
        // await model.creteQuestion(i, assignmentNumber, "", 0);
      }

      resolve("initQuestionSuccess");
    } catch (error) {
      reject({
        message: "initQuestionFailed",
        error: error
      });
    }
  });
};

module.exports = {
  initQuestion: initQuestion
};
