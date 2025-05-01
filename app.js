var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");

var indexRouter = require("./routes/v1/index");
var authorsRouter = require("./routes/v1/authors");
// var postsRouter = require("./routes/v1/posts");
var contactsRouter = require("./routes/v1/contacts");
var categoriesRouter = require("./routes/v1/categories");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: [
      "http://localhost:4000",
      "https://gallery-kappa-blond.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// connect to MongoDB Cloud
mongoose
  .connect(config.mongodb_cloud_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(">>> Kết nối MongoDB Cloud thành công"))
  .catch((error) => console.log(">>> Kết nối MongoDB Cloud thất bại", error));

app.use("/api/v1/", indexRouter);
app.use("/api/v1/authors", authorsRouter);
// app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/contacts", contactsRouter);
app.use("/api/v1/categories", categoriesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
