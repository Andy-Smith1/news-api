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

exports.selectArticles = async (sort_by = "created_at") => {
  const articles =
    await db.query(`SELECT articles.article_id, title, articles.votes, topic, articles.author, articles.created_at,
    count(comments.body) AS comment_count 
    FROM articles
    LEFT OUTER JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by};`);
  return articles.rows;
};
