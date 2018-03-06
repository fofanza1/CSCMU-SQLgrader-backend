var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const data = {
    name: 'Pakpoom'
  }
  res.send(data);
});

module.exports = router;
