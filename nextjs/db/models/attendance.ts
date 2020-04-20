import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var schema = new Schema({
  date: String,
  memberAttendanceList: Schema.Types.Mixed,
});

delete mongoose.connection.models['Attendance'];
export default mongoose.model('Attendance', schema);