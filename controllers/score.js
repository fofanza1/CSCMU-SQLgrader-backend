var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const saltRounds = 10;

const assignScore = (AllScore, DataStudent) => {
  return new Promise(async (resolve, reject) => {
    var i = 0;
    for (let score of AllScore) {
      i = 0;
      for (let data of DataStudent) {
        if (score.studentid === data.studentid) {
          DataStudent[i].score = score.max;
          break;
        }
        i += 1;
      }
    }
    resolve(DataStudent);
  });
};

module.exports = {
  assignScore: assignScore
};
