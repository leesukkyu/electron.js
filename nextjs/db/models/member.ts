import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    position: String,
});

delete mongoose.connection.models['Member'];
export default mongoose.model('Member', schema);
