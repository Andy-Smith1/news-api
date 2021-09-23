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
