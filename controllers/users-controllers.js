const {
  selectUsers,
  selectUserByUsername,
  addUser,
  updateUser,
} = require("../models/users-models");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await selectUserByUsername(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { body } = req;
    const user = await addUser(body);
    res.status(201).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const { body } = req;
    const { username } = req.params;
    const user = await updateUser(username, body);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
