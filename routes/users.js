var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const passport = require("passport");
const { User } = require("../models/users");

const jwtAuth = passport.authenticate("jwt", { session: false });
router.get("/", (req, res) => {
  try {
    User.find({}).then(allusers => {
      res.json({ allusers });
    });
  } catch (err) {
    res.json({ err });
  }
});
router.get("/for_tests", (req, res) => {
  try {
    User.find({}).then(allusers => {
      res.json({ allusers });
    });
  } catch (err) {
    res.json({ err });
  }
});

//---------------------------- CREATE NEW USER ----------------------------------------
router.post("/", jsonParser, (req, res) => {
  const requiredFields = [
    "FirstName",
    "LastName",
    "EmailAddress",
    "username",
    "password",
    "numRoomates",
    "budget",
    "culture"
  ];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Missing field",
      location: missingField
    });
  }

  const stringFields = [
    "FirstName",
    "LastName",
    "username",
    "EmailAddress",
    "password",
    "numRoomates",
    "budget",
    "culture"
  ];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== "string"
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Incorrect field type: expected string",
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ["username", "password"];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Cannot start or end with whitespace",
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      "min" in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      "max" in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let { username, password, firstName = "", lastName = "" } = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({ username })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: "ValidationError",
          message: "Username already taken",
          location: "username"
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        EmailAddress: req.body.EmailAddress,
        username: req.body.username,
        password: hash,
        budget: req.body.budget,
        numRoomates: req.body.numRoomates,
        culture: req.body.culture
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      console.log(err);
      if (err.reason === "ValidationError") {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

router.get("/", (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

//-------------------------------------------PUT ENDPOINT ----------------------------------
router.put("/:id", jsonParser, (req, res) => {
  const requiredFields = [
    "id",
    "FirstName",
    "LastName",
    "EmailAddress",
    "numRoomates",
    "budget",
    "culture"
  ];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${
      req.params.id
    }) and request body id ``(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post with id \`${req.params.id}\``);

  const updatedItem = {
    id: req.params.id,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    EmailAddress: req.body.EmailAddress,
    budget: req.body.budget,
    numRoomates: req.body.numRoomates,
    culture: req.body.culture
  };

  User.findByIdAndUpdate(req.body.id, updatedItem, { new: true })
    .then(updatedItem => {
      console.log(updatedItem);
      res.status(201).json(updatedItem.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});

//-----------------------------------------------------------Delete Endpint ---------------------
router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success, my friend!" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});
//---
module.exports = router;
