// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const Users = require("./users-model.js");
const express = require("express");
const { restricted } = require("../auth/auth-middleware");

const router = express.Router();

router.get("/", restricted, async (req, res, next) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
