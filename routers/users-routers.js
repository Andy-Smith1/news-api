const express = require("express");
const {
  getUsers,
  getUserByUsername,
  createUser,
} = require("../controllers/users-controllers");

const usersRouter = express.Router();

usersRouter.get("/", getUsers);
usersRouter.post("/", createUser);
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
