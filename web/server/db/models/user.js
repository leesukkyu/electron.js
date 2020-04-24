const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
  username: String,
  password: String,
});

delete mongoose.connection.models['User'];
module.exports = mongoose.model('User', schema);
