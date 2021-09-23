const db = require("../db/connection");

exports.removeComment = async (comment_id) => {
  const deletedComment = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING*;`,
    [comment_id]
  );
  if (deletedComment.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Comment not found" });
  }
  return deletedComment.rows;
};

exports.updateComment = async (comment_id, body) => {
  const updateBy = body.inc_votes;
  const updatedComment = await db.query(
    `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING*;`,
    [updateBy, comment_id]
  );
  return updatedComment.rows[0];
};
