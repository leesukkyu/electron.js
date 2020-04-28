const express = require('express');
const router = express.Router();

const DIST_DIR = __dirname;
/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.user) {
    res.render('main.html');
  } else {
    res.render('login.html');
  }
});
router.get('/main', function (req, res, next) {
  if (req.session.user) {
    res.render('main.html');
  } else {
    res.render('index.html');
  }
});
module.exports = router;
