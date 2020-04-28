const express = require('express');
const router = express.Router();

const DIST_DIR = __dirname;
/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.user) {
    res.sendFile(path.join(DIST_DIR, 'main.html'));
  } else {
    res.sendFile(path.join(DIST_DIR, 'login.html'));
  }
});

module.exports = router;
