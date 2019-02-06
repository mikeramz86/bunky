//server
"use strict";
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");

var path = require("path");
var logger = require("morgan");
var users = require("./routes/users");
var logged_in = require("./routes/logged_in");

const { router: authRouter, localStrategy, jwtStrategy } = require("./auth");

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "public")));

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/api/auth/", authRouter);
app.use("/users", users);
app.use("/logged_in", logged_in);

const jwtAuth = passport.authenticate("jwt", { session: false });

app.get("/api/protected", jwtAuth, (req, res) => {
  return res.json({
    data: "rosebud"
  });
});

app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});

let server;
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on("error", err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}
module.exports = { app, runServer, closeServer };
