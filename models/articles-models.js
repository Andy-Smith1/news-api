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

  if (typeof body.inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "inc_votes must be a number. e.g {inc_votes: 1}",
    });
  }

  const updatedArticle = await db.query(
    `UPDATE articles
  SET votes = votes + $1 WHERE article_id = $2 RETURNING*;`,
    [body.inc_votes, article_id]
  );
  return updatedArticle.rows[0];
};

exports.selectArticles = async (
  sort_by = "created_at",
  order = "asc",
  topic,
  limit = 10,
  p = 1
) => {
  const validColumns = [
    "article_id",
    "title",
    "votes",
    "topic",
    "author",
    "created_at",
    "comment_count",
  ];
  const offset = (p - 1) * limit;

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
  }
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryString = `SELECT articles.article_id, title, articles.votes, topic, articles.author, articles.created_at,
    count(comments.body) AS comment_count 
    FROM articles
    LEFT OUTER JOIN comments
    ON articles.article_id = comments.article_id `;

  const topicSlugs = await db.query(`SELECT slug FROM topics;`);

  if (topic) {
    if (!topicSlugs.rows.find((row) => row.slug === topic)) {
      return Promise.reject({ status: 400, msg: "Invalid topic query" });
    } else {
      queryString += `WHERE articles.topic = '${topic}' `;
    }
  }

  queryString += `GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`;
  const allArticles = await db.query(queryString);
  const totalArticles = allArticles.rows.length;
  const limitedArticles = await db.query(`${queryString} LIMIT $1 OFFSET $2;`, [
    limit,
    offset,
  ]);

  return { articles: limitedArticles.rows, totalArticles };
};

exports.selectArticleComments = async (article_id) => {
  const comments = await db.query(
    `SELECT author, body, comment_id, created_at, votes FROM comments WHERE article_id = $1;`,
    [article_id]
  );

  if (comments.rows.length === 0) {
    const checkId = await db.query(
      `SELECT * FROM articles WHERE article_id = $1;`,
      [article_id]
    );

    if (checkId.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found!" });
    }
  }

  return comments.rows;
};

exports.insertComment = async (article_id, body) => {
  const commentBody = body.body;
  const author = body.username;

  if (Object.keys(body).length > 2) {
    return Promise.reject({
      status: 400,
      msg: "Please ONLY provide valid username and body. e.g {username: validUser, body:someText}",
    });
  }

  if (!commentBody || !author) {
    return Promise.reject({
      status: 400,
      msg: "Please provide valid username and body. e.g {username: validUser, body:someText}",
    });
  }

  const newComment = await db.query(
    `INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING*;`,
    [article_id, commentBody, author]
  );
  return newComment.rows[0];
};
