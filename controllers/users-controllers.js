const { selectUsers } = require("../models/users-models");

exports.getUsers = async (req, res, next) => {
  const users = await selectUsers();
};
