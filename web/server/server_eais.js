const createError = require('http-errors');

const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const path = require('path');

const cookieParser = require('cookie-parser');

const pageRouter = require('./routes/page');

const apiRouter = require('./routes/api');

const app = express();

const database = require('./db/database');

const session = require('express-session');

const CONFIG = require('./config');

database.connect();

app.use(session({ secret: CONFIG.KEY, cookie: { maxAge: 60000 } }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// cors
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use('/', pageRouter);
app.use('/api', apiRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

try {
  app.listen(5500);
  console.log('5500 포트 시작');
} catch (error) {
  console.log('error');
}

module.exports = app;
