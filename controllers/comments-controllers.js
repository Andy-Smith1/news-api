const { removeComment, updateComment } = require("../models/comments-models");

exports.deleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const comment = await removeComment(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.patchComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const { body } = req;
    const comment = await updateComment(comment_id, body);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};
