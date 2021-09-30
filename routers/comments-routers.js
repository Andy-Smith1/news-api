const express = require("express");
const {
  deleteComment,
  patchCommentVotes,
  patchCommentBody,
} = require("../controllers/comments-controllers");

const commentsRouter = express.Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .patch(patchCommentVotes);

commentsRouter.patch("/:comment_id/body", patchCommentBody);

module.exports = commentsRouter;
