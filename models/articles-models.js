const db = require("../db/connection.js");
const { countComments } = require("../db/utils/data-manipulation.js");

exports.selectArticlesById = async (article_id) => {
  const result = await db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [article_id]
  );

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not found!" });
  }

  const commentCount = await countComments(article_id);
  const article = result.rows[0];
  article.comment_count = commentCount;
  return article;
};

exports.updateArticleVotes = async (article_id, body) => {
  const keys = Object.keys(body);
  if (!body.hasOwnProperty("inc_votes") || keys.length > 1) {
    return Promise.reject({
      status: 400,
      msg: "Only send votes update. e.g {inc_votes: 1}",
    });
  }

  const updatedArticle = await db.query(
    `UPDATE articles
  SET votes = votes + $1 WHERE article_id = $2 RETURNING*;`,
    [body.inc_votes, article_id]
  );
  return updatedArticle.rows[0];
};

exports.selectArticles = async () => {
  const results = await db.query("SELECT * FROM articles;");
  const articles = results.rows;

  const articlesWithComments = await Promise.all(
    articles.map(async (article) => {
      const commentCount = await countComments(article.article_id);
      article.comment_count = commentCount;
      delete article.body;
      return article;
    })
  );

  return articlesWithComments;
};
