// extract any functions you are using to manipulate your data, into this file
const db = require("../../db/connection");
const users = require("../data/development-data/users");

// afterAll(() => db.end());

exports.formatData = (data) => {
  return data.map((item) => {
    return Object.values(item);
  });
};

exports.countComments = async (article_id) => {
  const comments = await db.query(
    `SELECT * FROM articles
  JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1;`,
    [article_id]
  );
  return comments.rows.length;
};
