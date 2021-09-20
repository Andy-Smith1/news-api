const db = require("../connection.js");
const { formatData } = require("../utils/data-manipulation.js");
const format = require("pg-format");

const seed = async (data) => {
  const { articleData, commentData, topicData, userData } = data;
  try {
    await db.query("DROP TABLE IF EXISTS topics, users, articles, comments;");
    await db.query(`CREATE TABLE topics(
      slug VARCHAR(30) PRIMARY KEY,
      description VARCHAR(250) NOT NULL
    );`);
    await db.query(`CREATE TABLE users (
      username VARCHAR(30) PRIMARY KEY,
      avatar_url VARCHAR(250),
      name VARCHAR(30) NOT NULL
    );`);
    await db.query(`CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(250) NOT NULL,
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      topic VARCHAR(30) REFERENCES topics(slug),
      author VARCHAR(30) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT NOW()
    );`);
    await db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(30) REFERENCES users(username),
      article_id INT REFERENCES articles(article_id),
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      body TEXT NOT NULL
    );`);
    await db.query(
      format(
        `INSERT INTO topics
    (description, slug)
    VALUES %L
    RETURNING *;`,
        formatData(topicData)
      )
    );
    await db.query(
      format(
        `INSERT INTO users
    (username, name, avatar_url) VALUES %L RETURNING *;`,
        formatData(userData)
      )
    );
    await db.query(
      format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes)
        VALUES %L RETURNING *;`,
        formatData(articleData)
      )
    );
    await db.query(
      format(
        `INSERT INTO comments 
    (body, votes, author, article_id, created_at) VALUES %L RETURNING*;`,
        formatData(commentData)
      )
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = seed;
