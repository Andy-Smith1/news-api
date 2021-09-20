const db = require("../connection.js");

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
      created_at INT DEFAULT ${Date.now()}
    );`);
    await db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(30) REFERENCES users(username),
      article_id INT REFERENCES articles(article_id),
      VOTES INT DEFAULT 0,
      created_at INT DEFAULT ${Date.now()},
      body TEXT NOT NULL
    );`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = seed;
