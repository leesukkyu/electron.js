const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.user) {
    res.render('main.html');
  } else {
    res.render('login.html');
  }
});

module.exports = router;
