const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../controllers/passport");
const { register, login, refreshTokens, logout } = require("../controllers/userHandler");
const { getAllTasks, getTask, createTask, editTask, removeTask } = require("../controllers/taskHandler");

router.route("/")
  .get((req, res) => res.json("Welcome to Tasker"));

// USER
router.route("/register")
  .post(register);

router.route("/login")
  .post(login);

router.route("/refresh-tokens")
  .get(refreshTokens)

router.route("/logout")
  .get(passport.authenticate("jwt", { session: false }), logout)

// TASK
router.route("/tasks")
  .get(passport.authenticate("jwt", { session: false }), getAllTasks)

router.route("/task")
  .post(passport.authenticate("jwt", { session: false }), createTask);

router.route("/task/:id")
  .get(passport.authenticate("jwt", { session: false }), getTask)
  .put(passport.authenticate("jwt", { session: false }), editTask)
  .delete(passport.authenticate("jwt", { session: false }), removeTask);

module.exports = router;
