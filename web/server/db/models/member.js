const mongoose = require('mongoose');
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
module.exports = mongoose.model('Member', schema);