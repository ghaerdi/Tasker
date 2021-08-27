import { Request, Response, Router }from "express";
import { register, login, refreshTokens, logout } from "../controllers/userHandler";
import { getAllTasks, getTask, createTask, editTask, removeTask } from "../controllers/taskHandler";
import passport from "passport";
import "../controllers/passport";

const router = Router();

router.route("/")
  .get((_req: Request, res: Response) => res.json("Welcome to Tasker"));

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

export default router;
