import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var schema = new Schema({
  username: String,
  password: String,
});

delete mongoose.connection.models['User'];
export default mongoose.model('User', schema);