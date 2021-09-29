const db = require("../db/connection");

exports.selectTopics = async () => {
  const topics = await db.query(`SELECT * FROM topics`);
  return topics.rows;
};

exports.addTopic = async (body) => {
  const { slug, description } = body;
  const newTopic = await db.query(
    `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING*;`,
    [slug, description]
  );
  return newTopic.rows[0];
};
