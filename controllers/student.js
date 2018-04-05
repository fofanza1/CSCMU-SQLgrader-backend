var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const saltRounds = 10;

const hashPassword = password => {
  return new Promise(async (resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
};

const checkPassword = (password, hashPassword) => {
  return new Promise(async (resolve, reject) => {
    bcrypt.compare(password, hashPassword, function(err, res) {
      if (err) {
        reject(err);
      } else if (res === true) {
        resolve(true);
      } else if (res === false) {
        reject(false);
      }
    });
  });
};

const genToken = data => {
  return new Promise(async (resolve, reject) => {
    data = JSON.parse(JSON.stringify(data));
    const jwtToken = jwt.sign(data, "SQLgraderCMUniversitY", {
      expiresIn: "1h"
    });
    resolve(jwtToken);
  });
};

module.exports = {
  hashPassword: hashPassword,
  checkPassword: checkPassword,
  genToken: genToken
};
