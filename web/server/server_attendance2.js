!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="/",t(t.s=3)}([function(e,n){e.exports=require("mongoose")},function(e,n){e.exports=require("express")},function(e,n){e.exports={DB:{DB_URI:"mongodb+srv://ansua86:tjrrnddl1!@cloud-pmbuu.mongodb.net/arsco_attendance"},KEY:"leesukkyu"}},function(e,n,t){t(4);var r=t(1),o=t(5),s=t(6),i=t(7);const u=t(8),c=t(9),a=t(10),d=t(11),f=t(15),l=t(16),p=t(2);f.connect();const m=r();m.set("etag",!1),m.use(l({secret:p.KEY,cookie:{maxAge:6e5}})),m.set("views",o.join(__dirname,"views")),m.set("view engine","ejs"),m.engine("html",t(17).renderFile),m.use(i("dev")),m.use(c()),m.use(r.json()),m.use(r.urlencoded({extended:!1})),m.use(s()),m.use(r.static(o.join(__dirname,"public"))),m.use(u.json()),m.use(u.urlencoded({extended:!0})),m.use((function(e,n,t){t()})),m.use("/",a),m.use("/api",d),m.use((function(e,n,t,r){t.locals.message=e.message,t.locals.error="development"===n.app.get("env")?e:{},t.status(e.status||500),t.render("error")}));try{m.listen(6001),console.log("6001 포트 시작")}catch(e){console.log("error")}e.exports=m},function(e,n){e.exports=require("http-errors")},function(e,n){e.exports=require("path")},function(e,n){e.exports=require("cookie-parser")},function(e,n){e.exports=require("morgan")},function(e,n){e.exports=require("body-parser")},function(e,n){e.exports=require("cors")},function(e,n,t){const r=t(1).Router();__dirname;r.get("/",(function(e,n,t){e.session.user?n.render("main.html"):n.render("login.html")})),r.get("/main",(function(e,n,t){e.session.user?n.render("main.html"):n.render("index.html")})),e.exports=r},function(e,n,t){const r=t(1).Router(),o=t(12),s=t(13),i=t(14);function u(e){return!!e.session.user}r.post("/login",(function(e,n,t){o.find({username:{$eq:e.body.username},password:{$eq:e.body.password}}).then(t=>{t.length?(e.session.user=t[0],n.status(200).json({isErr:!1})):n.status(200).json({isErr:!0})}).catch(()=>{n.status(200).json({isErr:!0})})})),r.post("/logout",(function(e,n,t){e.session.destroy(()=>{n.status(200).json({isErr:!1})})})),r.get("/member",(function(e,n,t){s.find({}).then(e=>{n.status(200).json({memberList:e,isErr:!1})}).catch(()=>{n.status(200).json({isErr:!0})})})),r.post("/member",(function(e,n,t){s.create({name:e.body.name,position:e.body.position}).then(e=>{n.status(200).json({member:e,isErr:!1})}).catch(()=>{n.status(200).json({isErr:!0})})})),r.delete("/member",(function(e,n,t){u(e)||n.status(200).json({isErr:!0});const r=e.query.id;s.findByIdAndRemove(r).then(()=>{n.status(200).json({isErr:!1})}).catch(()=>{n.status(200).json({isErr:!0})})})),r.get("/attendance",(function(e,n,t){i.find({date:{$eq:e.query.date}}).then(e=>{n.status(200).json({attendanceData:e[0]?e[0]:{}})}).catch(()=>{n.status(200).json({isErr:!0})})})),r.post("/attendance",(function(e,n,t){u(e)||n.status(200).json({isErr:!0}),i.findOneAndUpdate({date:{$eq:e.body.date}},{date:e.body.date,memberAttendanceList:e.body.memberAttendanceList},{upsert:!0}).then(()=>{n.status(200).json({isErr:!1})}).catch(()=>{n.status(200).json({isErr:!0})})})),e.exports=r},function(e,n,t){const r=t(0);var o=new(0,r.Schema)({username:String,password:String});delete r.connection.models.User,e.exports=r.model("User",o)},function(e,n,t){const r=t(0);var o=new(0,r.Schema)({name:{type:String,unique:!0,required:!0},position:String});delete r.connection.models.Member,e.exports=r.model("Member",o)},function(e,n,t){const r=t(0),o=r.Schema;var s=new o({date:String,memberAttendanceList:o.Types.Mixed});delete r.connection.models.Attendance,e.exports=r.model("Attendance",s)},function(e,n,t){const r=t(2),o=t(0);e.exports={connect:function(){return o.connect(r.DB.DB_URI,{useNewUrlParser:!0,useFindAndModify:!1,useUnifiedTopology:!0})},close:function(){return o.connection.close()},getReadyState:function(){return o.connection.readyState}}},function(e,n){e.exports=require("express-session")},function(e,n){e.exports=require("ejs")}]);