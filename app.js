const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const logger = (req, res, next) => {
  console.log("Logging...");
  next();
};

app.use(logger);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(3000, () => {
  console.log("Server started on port 3000...");
});
