const db = require("../db/connection");
const commentsRouter = require("../routers/comments-routers");

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

exports.updateCommentVotes = async (comment_id, body) => {
  const updateBy = body.inc_votes;
  const updatedComment = await db.query(
    `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING*;`,
    [updateBy, comment_id]
  );

  if (updatedComment.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Comment not found" });
  }
  if (!body.inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Please provide inc_votes property e.g {inc_votes: 1}",
    });
  }
  if (Object.keys(body).length > 1) {
    return Promise.reject({
      status: 400,
      msg: "Please ONLY provide inc_votes property e.g {inc_votes: 1}",
    });
  }

  return updatedComment.rows[0];
};

exports.updateCommentBody = async (comment_id, body) => {
  const comment = await db.query(
    `UPDATE comments SET body = $1 WHERE comment_id = $2 RETURNING*;`,
    [body.body, comment_id]
  );
  if (comment.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Comment not found" });
  }
  return comment.rows[0];
};
