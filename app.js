const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const expressValidator = require("express-validator");
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");
const mongojs = require("mongojs");
const ObjectId = mongojs.ObjectId;

const db = mongojs("customerapp", ["users"]);
const app = express();

/*
const logger = (req, res, next) => {
  console.log("Logging...");
  next();
};

app.use(logger);
*/

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parser middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Set static path
app.use(express.static(path.join(__dirname, "public")));

// Global Vars
app.use((req, res, next) => {
  res.locals.errors = null;
  next();
});

app.get("/", (req, res) => {
  db.users.find(function(err, docs) {
    res.render("index", {
      title: "Customers",
      users: docs
    });
  });
});

app.post(
  "/users/add",
  [
    check("first_name", "First name is required!")
      .isLength({ min: 1 })
      .trim(),
    check("last_name", "Last name is required!")
      .isLength({ min: 1 })
      .trim(),
    check("email", "Email is required!")
      .isLength({ min: 1 })
      .trim()
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("index", {
        title: "Customers",
        users,
        errors: errors.array()
      });
      return;
    }

    const newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
    };

    db.users.insert(newUser, function(err, result) {
      if (err) {
        console.log(err);
      }
      res.redirect("/");
    });
  }
);

app.delete("/users/delete/:id", function(req, res) {
  console.log(req.params.id);
  db.users.remove({ _id: ObjectId(req.params.id) }, function(err, result) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000...");
});
