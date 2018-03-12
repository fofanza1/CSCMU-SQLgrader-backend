var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var index = require("./routes/index");
var users = require("./routes/users");
var databases = require("./routes/databases");
var assignments = require("./routes/assignments");
var cors = require("cors");
var app = express();
var kue = require("kue");
kue.app.listen(3001);
// queue = kue.createQueue();
// for (i = 0; i < 3; i++) {
//   var job = queue
//     .create("data-test", {
//       title: "test title",
//       data: "eiei",
//       data2: "eiei2"
//     })
//     .save();
// }

// queue.on("job complete", function(id) {
//   kue.Job.get(id, function(err, job) {
//     job.remove();
//   });
// });
// const a = async () => {
//   return new Promise(async (resolve, reject) => {
//     setTimeout(async () => {
//       resolve("eiei");
//     }, 5000);
//   });
// };

// queue.process("data-test", 1, async function(job, done) {
//   await console.log(job.id + " " + Date());
//   var test = await a();
//   await console.log(test);
//   // await setInterval(function() {
//   //   console.log("eiei");
//   //   //called 5 times each time after one second
//   //   //before getting cleared by below timeout.
//   // }, 5000); //delay is in milliseconds
//   // await email(job.data.data, done);
//   await done();
// });

// async function email(address, done) {
//   await console.log(address);
//   await done(address);
// }

// view engine setup
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "jade");
dotenv.load();
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
// app.use(cors({credentials: true, origin: true}));
// app.options('*', cors());
var allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Origin, Authorization, Content-Type, Accept"
  );
  next();
};
app.use(allowCrossDomain);
// app.use(cors({credentials: true, origin: 'http://localhost:4200'}));
// app.options('*', cors());  // enable pre-flight
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);
app.use("/users", users);
app.use("/databases", databases);
app.use("/assignments", assignments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
