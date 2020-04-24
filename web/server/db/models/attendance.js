const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
  date: String,
  memberAttendanceList: Schema.Types.Mixed,
});

delete mongoose.connection.models['Attendance'];
module.exports = mongoose.model('Attendance', schema);
