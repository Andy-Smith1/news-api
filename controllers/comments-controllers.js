const {
  removeComment,
  updateCommentVotes,
  updateCommentBody,
} = require("../models/comments-models");

exports.deleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const comment = await removeComment(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.patchCommentVotes = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const { body } = req;
    const comment = await updateCommentVotes(comment_id, body);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.patchCommentBody = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const { body } = req;
    const comment = await updateCommentBody(comment_id, body);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};
