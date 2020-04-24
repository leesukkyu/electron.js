const CONFIG = require('../config');

const mongoose = require('mongoose');

const connent = function () {
  return mongoose.connect(CONFIG.DB.DB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

const close = function () {
  return mongoose.connection.close();
};

const getReadyState = function () {
  return mongoose.connection.readyState;
};

module.exports = {
  connect: connent,
  close: close,
  getReadyState: getReadyState,
};
