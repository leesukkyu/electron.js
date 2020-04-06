const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 컬렉션 명을 매일 바꿔야 하기 때문에 모델 생성 함수를 export 한다
var schema = new Schema({
  date: Date,
  attendance: Schema.Types.Mixed,
});

module.exports = mongoose.model("Info", schema);
