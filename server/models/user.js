const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  userName: String,
  password: String,
});

module.exports = mongoose.model("Info", schema);
