const express = require("express");
const {
  getUsers,
  getUserByUsername,
  createUser,
  editUser,
} = require("../controllers/users-controllers");

const usersRouter = express.Router();

usersRouter.route("/").get(getUsers).post(createUser);

// usersRouter.get("/", getUsers);
// usersRouter.post("/", createUser);
// usersRouter.get("/:username", getUserByUsername);

usersRouter.route("/:username").get(getUserByUsername).patch(editUser);

module.exports = usersRouter;
