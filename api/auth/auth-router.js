const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
} = require("./auth-middleware");
const router = express.Router();

router.post(
  "/register",
  checkPasswordLength,
  checkUsernameFree,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const hash = bcrypt.hashSync(password, 8);
      const newUser = { username, password: hash };
      const user = await Users.add(newUser);

      if (user) {
        res.status(201).json(user);
      } else {
        next({ status: 400, message: "no user added" });
      }
    } catch (err) {
      next(err);
    }
  }
);

router.post("/login", checkUsernameExists, (req, res, next) => {
  const { password } = req.body;

  if (bcrypt.compareSync(password, req.user.password)) {
    req.session.user = req.user;
    res.json({ message: `Welcome ${req.user.username}` });
  } else {
    next({ status: 401, message: "Invalid credentials" });
  }
});

router.get("/logout", (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.json({ message: "logged out" });
      }
    });
  } else {
    res.json({ message: "no session" });
  }
});

module.exports = router;
