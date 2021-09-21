const db = require("../db/connection.js");

exports.selectArticlesById = async (article_id) => {
  const result = await db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [article_id]
  );
  const comments = await db.query(
    `SELECT * FROM articles
  JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1;`,
    [article_id]
  );

  const commentCount = comments.rows.length;
  const article = result.rows[0];
  article.comment_count = commentCount;
  return article;
};
