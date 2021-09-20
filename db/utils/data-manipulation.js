// extract any functions you are using to manipulate your data, into this file

const users = require("../data/development-data/users");

exports.formatData = (data) => {
  return data.map((item) => {
    return Object.values(item);
  });
};
